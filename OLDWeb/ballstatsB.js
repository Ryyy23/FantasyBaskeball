var teamPlayers = [];
var url = './viewteam.html'

//New vars
var currentLogin = null;
var loginStatus = false;

function LoadCreate(){  
    $("#teamCreate").append(`<span><form> Create a team: <input id="teamCreator"/></form></span>`)
}

function SendTeam(){
    console.log(teamPlayers)
    console.log(username)
    var teamJSON = {
        User: username,
        TeamName: $("#teamCreator").val(),
        Player1: teamPlayers[0],
        Player2: teamPlayers[1],
        Player3: teamPlayers[2],
        Player4: teamPlayers[3],
        Player5: teamPlayers[4],
        Player6: teamPlayers[5],
        Player7: teamPlayers[6],
        Player8: teamPlayers[7],
        Player9: teamPlayers[8],
        Player10: teamPlayers[9],
        Player11: teamPlayers[10],
        Player12: teamPlayers[11],
        Player13: teamPlayers[12],
        Player14: teamPlayers[13],
        Player15: teamPlayers[14]
    };
    console.log(teamJSON)
    $.post("https://ballstatsapi.azurewebsites.net/api/userteams/",teamJSON);
    window.location.href = url;
};

function Remove(arr, value) {
    var tempArr = [];
    for (var item in arr){
        if (arr[item] != value){
            tempArr.push(arr[item])
        }
    }
    return tempArr;
}

$(document).on('keyup','#teamCreator', function (){
    if (!$("#teamCreator").val().length > 0){
        $("#submitBtn").prop("disabled", true)
    }
    else{
        $("#submitBtn").prop("disabled", false)
    }
});

$(document).on('click','.add', function () {
    if (teamPlayers.length < 15){    
        $(this).removeClass('add') 
        $(this).addClass('added')
        var name = this.parentNode.parentNode.childNodes[0].innerHTML;
        var id = this.parentNode.parentNode.getAttribute("player-id");      
        var row = this.parentNode.parentNode; 
        $(row).css('background-color','#90eda8')
        $("#teamTab").append(`<tr><td id="${id}">ID: ${id} - ${name}</td><td><i class="remove fas fa-minus-square"></i></td></tr>`)
        teamPlayers.push(id);
    }
    if (teamPlayers.length == 15){
        $("#subBtn").append("<button type='button' class='btn btn-secondary' id='submitBtn' onClick='SendTeam();'>SUBMIT</button>")
        console.log(teamPlayers)
        if (!$("#teamCreator").val().length > 0){
            $("#submitBtn").prop("disabled", true)
        }
    }
});
$(document).on('click','.remove', function () {
    var id = this.parentNode.parentNode.childNodes[0].getAttribute('id')
    var row = this.parentNode.parentNode; 
    $(row).remove();
    $(`tr[player-id="${id}"]`).css('background-color','white');
    $(`tr[player-id="${id}"]`).children(6).children(0).removeClass('added')
    $(`tr[player-id="${id}"]`).children(6).children(0).addClass('add')
    teamPlayers = Remove(teamPlayers, id);
    if (teamPlayers.length < 15){
        $("#subBtn").empty();
        console.log(teamPlayers)
    }
});




function RenderPlayerList(pScroller)
{
    $('#playerTab').DataTable( {
        ajax: {
            url: 'https://ballstatsapi.azurewebsites.net/api/players/',
            "dataSrc": function (d) {       
                return d
            }
        },
        columns:[
            {data: 'NAME'},
            {data: 'TEAM'},
            {data: 'AGE'},
            {data: 'RAT'},
            {data: 'MIN'},
            {data: 'W_L'},
            {
                data: null,
                render: function ( data, type, row ) {
                    return '<i class="add fas fa-plus-square"></i>';
                }
            }
        ],
        createdRow: function (data, row){
            $(data).attr('player-id', row.ID)
        },
        "aoColumnDefs": [ {
            "aTargets": [ 3,4,5 ],
            "mRender": function (data) {
                var formmatedvalue = data.toFixed(2)
                return formmatedvalue;
            }
        }],
        "bLengthChange": false,
        "iDisplayLength": 15,
        "dom": '<"pull-left"f><"pull-right"l>tip',
 
         scrollY: 600, 
         scroller: pScroller 

    }
    );
}

// pagination True
function PaginationTrue()
{
    $('#playerTab').DataTable().destroy();
    RenderPlayerList(true);
    $("#playerCreate").css("width","45vw");
    $("#teamTab").css("width","35vw");
    $('#Main').css('visibility','visible');
}

// pagination false
function PaginationFalse()
{
    $('#playerTab').DataTable().destroy();
    RenderPlayerList(false);
    $('#Main').css('visibility','visible');
    
}

function checkinfiniteScroll()
{    
    if (document.getElementById('infiniteScroll').checked === true) {
        PaginationTrue();       
    } 
    else
    {
        PaginationFalse();             
    }  
    //alert('infiniteScroll: '+ infiniteScroll); 
} 
// Defualt load Pagination 

$(document).ready(function () 
{
    $(document).on("keypress", "form", function(event) 
    { 
            return event.keyCode != 13;
    });
    
    RenderPlayerList(false); ///deadbug was true, should of been false!!
    $("#playerCreate").css("width","45vw")
    $("#teamTab").css("width","35vw")
    
});

 function Confirm(){ //Code edited to check for a login before checking for a team name.
    if (loginStatus == false)
    {
        alert("You must be logged in!")
    }
    else
    {
        if (!$("#teamCreator").val() == ""){
            document.getElementById('teamForm').style.visibility = 'hidden';
            PaginationFalse();
               
        }
        else{
            alert("You must have a team name!")
        }
    }
}

//------NEW CODE (Includes login and create user feature)------

//Login function to check if player exists
function loginFunction() {
    username = document.getElementById("loginInput").value
    //password = document.getElementById("loginPSWInput").value

    $.ajax({
        url: "https://bsapinew.azurewebsites.net/api/user/",
        dataType: "JSON",
        async: false,
        success: function(data){
            //console.log(data);
            for(let i = 0; i < data.length; i++){ //Checks to see if the user exists in the database
                if(data[i].UserName===username){
                    console.log(username);
                    currentLogin = username;
                    loginStatus = true;
                    //console.log("Currently logged in as " + currentLogin + "? " + loginStatus);
                    document.getElementById('id01').style.display='none'; //hides the login menu
                    alert("Successfully logged in as " + username)
                    return;
                }
            }
            alert("The user you entered does not exist!");
        }
    })
}

//Submits user to database, also checks to see if the user already exists before submitting to the database
function submitNewUser(){
    newusername = document.getElementById("NewUser").value;

    $.ajax({
        url: "https://bsapinew.azurewebsites.net/api/user/",
        dataType: "JSON",
        async: false,
        success: function(data){
            //console.log(data);
            for(let i = 0; i < data.length; i++){
                if(data[i].UserName===newusername){
                    alert("The username you have entered already exists!")
                    return;
                }
            }

            //console.log(newusername)
            //console.log(newpassword)
            var userJSON = {
                UserName: newusername
            };
            //console.log(userJSON)
            $.post("https://bsapinew.azurewebsites.net/api/user/",userJSON);
            currentLogin = newusername;
            loginStatus = true;
            //console.log("Currently logged in as " + currentLogin + "? " + loginStatus);
            alert("Your user has been created!")
            document.getElementById('id01').style.display='none'; //hides the login menu
        }
    })
}