var players = {};
var team = [];
var teamPlayers = [];
var url = './viewteam.html'
var Index = 0;
var username = Date.now().toString();
var $var = $('UserTeam');
var editedTeamName = "";

function GetPlayers() {
    $.ajax({
        url: "https://bsapinew.azurewebsites.net/api/players/",
        dataType: "JSON",
        async: false,
        crossDomain: true,
        success: function (data) {
            players = data;
        }
    });
}



function Remove(arr, value) {
    var tempArr = [];
    for (var item in arr) {
        if (arr[item] != value) {
            tempArr.push(arr[item])
        }
    }
    return tempArr;
}

function SendTeam() {
    console.log(teamPlayers)
    console.log(username)
    var s = document.getElementById(`TeamPick`);
    var teamID = s.options[s.selectedIndex].value;
    var teamJSON = {
        ID: parseInt(teamID),
        User: username,
        TeamName: `${editedTeamName}`,
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
    $.ajax({ //(Connor) This PUT will update on the database, but the table will not display the players properly.
        //Currently i don't know how to fix it and we can discuss it on Wednesday if needed.
        url: `https://bsapinew.azurewebsites.net/api/userteams/${teamID}`,
        type: "PUT",
        dataType: "JSON",
        data: teamJSON,
        async: false,
        crossDomain: true,
        error: function (data) {
            console.log(data)
        },
        success: function (data) {
            //players = data;
            //window.location.href = url;
            console.log(data);
            console.log(teamJSON);
        }
    });
    //$.put(`https://ballstatsapi.azurewebsites.net/api/userteams/${teamID}`, teamJSON);
    //window.location.href = url;
};

function RenderPlayerList(pScroller) {
    $('#playerTab').DataTable({
            ajax: {
                url: 'https://bsapinew.azurewebsites.net/api/players/',
                "dataSrc": function (d) {
                    return d;
                }
            },
            columns: [{
                    data: 'NAME'
                },
                {
                    data: 'AGE'
                },
                {
                    data: 'Position'
                },
                {
                    data: 'RAT'
                },
                {
                    data: 'FG_'
                },
                {
                    data: 'FT_'
                },
                {
                    data: 'TP_'
                },
                {
                    data: 'W_L'
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<i class="add fas fa-plus-square"></i>';
                    }
                }

            ],
            createdRow: function (data, row) {
                $(data).attr('player-id', row.ID);
            },
            "aoColumnDefs": [{
                "aTargets": [3, 4, 5, 6, 7],
                "mRender": function (data) {
                    var formmatedvalue = data.toFixed(2)
                    return formmatedvalue;
                }
            }],
            "bLengthChange": false,
            "iDisplayLength": 15,
            "dom": '<"pull-left"f><"pull-right"l>tip',

            scrollY: 475, //adjust the height here
            scroller: pScroller //BugDEAD!!

        }

    );  
}

// pagination True
function PaginationTrue() {
    $('#playerTab').DataTable().destroy();
    RenderPlayerList(true);
    $("#playerCreate").css("width", "45vw");
    $("#teamTab").css("width", "35vw");
    $('#Main').css('visibility', 'visible');
    console.log("paginationtrue");
}

// pagination false
function PaginationFalse() {
    $('#playerTab').DataTable().destroy();
    RenderPlayerList(false);
    $('#Main').css('visibility', 'visible');
    console.log("paginationfalse");

}

function checkinfiniteScroll() {
    if (document.getElementById('infiniteScroll').checked === true) {
        PaginationTrue();
        console.log("paginationtrue");

    } else {
        PaginationFalse();
        console.log("paginationfalse");
    }
    //alert('infiniteScroll: '+ infiniteScroll); 
}

// Defualt load Pagination 
$(document).ready(function () {
    $(document).on("keypress", "form", function (event) {
        return event.keyCode != 13;
    });

    RenderPlayerList(false);
    $("#playerCreate").css("width", "45vw")
    $("#teamTab").css("width", "35vw")

});


//(Jason) Aside from all the URLs in viewteam.js, this is the only thing I have changed, I made it so the table doesn't break if there is already an existing table
function LoadTeam() {
    var table = $("#UserTeam").DataTable();
    var s = document.getElementById(`TeamPick`);
    var teamID = s.options[s.selectedIndex].value;
    editedTeamName = s.options[s.selectedIndex].innerHTML;
    $('#Main').css('visibility', 'visible');
    team = [];
    table.destroy();

    $.ajax({
        url: `https://bsapinew.azurewebsites.net/api/userteams/${teamID}`,
        dataType: "JSON",
        async: false,
        crossDomain: true,
        success: function (data) {
            for (var i = 1; i < 16; i++) {
                team.push(players[data[`Player${i}`]]);
                teamPlayers.push(data[`Player${i}`]);
            }
            console.log(team);
            console.log(teamPlayers)
            $("#UserTeam").DataTable({
                data: team,
                columns: [{
                        data: 'NAME'
                    },
                    {
                        data: 'AGE'
                    },
                    {
                        data: 'Position'
                    },
                    {
                        data: 'RAT'
                    },
                    {
                        data: 'FG_'
                    },
                    {
                        data: 'FT_'
                    },
                    {
                        data: 'TP_'
                    },
                    {
                        data: 'W_L'
                    },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return '<i class="remove fas fa-minus-square"></i>';
                        }
                    }
                ],
                createdRow: function (data, row) {
                    $(data).attr('player-id', row.ID)
                },
                "aoColumnDefs": [{
                    "aTargets": [3, 4, 5, 6, 7],
                    "mRender": function (data) {
                        var formmatedvalue = data.toFixed(2)
                        return formmatedvalue;
                    }
                }, ],
                "paging": true,
                "bLengthChange": false,
                "iDisplayLength": 15,
                "dom": '<"pull-left"f><"pull-right"l>tip'
            });
        }
    });

    $("#UserTeam").css('visibility', 'visible')
}

$(document).ready(function () {
    GetPlayers();

    $.ajax({
        url: "https://bsapinew.azurewebsites.net/api/userteams/",
        dataType: "JSON",
        async: false,
        crossDomain: true,
        success: function (teamdata) {
            Userteams = teamdata;
        }
    });

    var ele = document.getElementById('TeamPick');
    for (var i = 0; i < Userteams.length; i++) {
        ele.innerHTML = ele.innerHTML +
            '<option value="' + Userteams[i]['ID'] + '">' + Userteams[i]['TeamName'] + '</option>';
    }
});

$(document).on('click', '.add', function () {
    if (teamPlayers.length < 15) {
        $(this).removeClass('add')
        $(this).addClass('added')
        var name = this.parentNode.parentNode.childNodes[0].innerHTML;
        var id = parseInt(this.parentNode.parentNode.getAttribute("player-id"));
        var age = this.parentNode.parentNode.childNodes[1].innerHTML;
        var position = this.parentNode.parentNode.childNodes[2].innerHTML;
        var rating = this.parentNode.parentNode.childNodes[3].innerHTML;
        var fg = this.parentNode.parentNode.childNodes[4].innerHTML;
        var ft = this.parentNode.parentNode.childNodes[5].innerHTML;
        var tp = this.parentNode.parentNode.childNodes[6].innerHTML;
        var wl = this.parentNode.parentNode.childNodes[7].innerHTML;
        var id = this.parentNode.parentNode.getAttribute("player-id");
        var row = this.parentNode.parentNode;
        $(row).css('background-color', '#90eda8')
        var newRow = $("#UserTeam").append(`<tr><td id=${id}>ID: ${id} - ${name}</td><td>${age}</td><td>${position}</td><td>${rating}</td><td>${fg}</td>
        <td>${ft}</td><td>${tp}</td><td>${wl}</td><td><i class="remove fas fa-minus-square"></i></td></tr>`).css('background-color', '#4b8caa')
        $var.find('td:last-child').before(newRow);
        newRow.find('tr').hide().fadeTo(3000, 1);
        teamPlayers.push(id);
    }
    if (teamPlayers.length == 15) {
        $("#subBtn").append("<button type='button' class='btn btn-secondary' Onclick='SendTeam();' id='submitBtn'>SUBMIT</button>")
        $('.add').prop("disabled", true)
        console.log(teamPlayers)
        if (!$("#UserTeam").val().length > 0) {
            $("#submitBtn").prop("disabled", true)
        }
    }
});

$(document).on('click', '.remove', function () {
    var id = this.parentNode.parentNode.childNodes[0].getAttribute('id')
    var id2 = this.parentNode.parentNode.getAttribute('player-id')
    teamPlayers = Remove(teamPlayers, id2 - 1);
    console.log(id2)
    console.log(teamPlayers)
    var row = this.parentNode.parentNode;
    $(row).remove();
    $(`tr[player-id="${id}"]`).css('background-color', 'white');
    $(`tr[player-id="${id}"]`).children(6).children(0).removeClass('added')
    $(`tr[player-id="${id}"]`).children(6).children(0).addClass('add')
    teamPlayers = Remove(teamPlayers, id);

    if (teamPlayers.length < 15) {
        $("#subBtn").empty();
        $('.add').prop("disabled", false)

    }
});

// pagination True
function PaginationTrue() {
    $('#playerTab').DataTable().destroy();
    RenderPlayerList(true);
    $("#playerCreate").css("width", "45vw")
    $("#teamTab").css("width", "35vw")
    $('#Main').css('visibility','visible');
}

// pagination false
function PaginationFalse() {
    $('#playerTab').DataTable().destroy();
    RenderPlayerList(false);
    $('#Main').css('visibility','visible');
}

function checkinfiniteScroll() {
    if (document.getElementById('infiniteScroll').checked === true) {
        PaginationTrue();
    } else {
        PaginationFalse();
    }
    //alert('infiniteScroll: '+ infiniteScroll); 
}