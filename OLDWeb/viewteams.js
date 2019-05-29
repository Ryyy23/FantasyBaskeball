let players = {};

function GetPlayers(){
    $.ajax({
        url: "https://ballstatsapi.azurewebsites.net/api/players",
        dataType: "JSON",
        async: false,
        crossDomain: true,
        success: function (data){
            players = data;
        }
    });
}

$(document).ready(function () {
    GetPlayers();

    $('#teamTable').DataTable( {
        ajax: {
            url: 'https://ballstatsapi.azurewebsites.net/api/Userteams/',
            "dataSrc": function (d) {       
                return d
            }
        },
        columns:[
            {data: 'User'},
            {data: 'TeamName'},
            {data: 'Player1'},
            {data: 'Player2'},
            {data: 'Player3'},
            {data: 'Player4'},
            {data: 'Player5'},
            {data: 'Player6'},
            {data: 'Player7'},
            {data: 'Player8'},
            {data: 'Player9'},
            {data: 'Player10'},
            {data: 'Player11'},
            {data: 'Player12'},
            {data: 'Player13'},
            {data: 'Player14'},
            {data: 'Player15'}
        ],
        "createdRow": function (row, data) {
            var i = -1;
            $.each($('td', row), function () {
                if (i > 0){
                    $(this).addClass('player')
                    $(this).attr('ID', data[`Player${i}`]);  
                }                    
                i++;
            });
        },
        "aoColumnDefs": [{
            "aTargets": [ 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16 ],
            "orderable": false,
            "mRender": function (data) {
                data = data - 1 ;
                return players[data]["NAME"]
            }
        }],
        // "aoColumnDefs": [{
        //     "aTargets": [ 0 ],
        //     "orderable": false,
        //     "mRender": function (data) {
        //         data = data - 1 ;
        //         return players[data]["NAME"]
        //     }
        // }],
        "bLengthChange": false,
        "iDisplayLength": 10,
        "dom": '<"pull-left"f><"pull-right"l>tip'
        },
    );
});

var hoverTimer;

function ShowTab(id,x,y){
    var player = players[id-1]["NAME"];
    $("#hoverTab").append(
        `<div style="padding-left: 5px; display: none; border-style: double; background-color: white;border-radius: 10px;" id="tab">
            <table>            
                <tr>
                    <td><strong>Name: </strong>${players[id-1]["NAME"]}</td>
                    <td rowspan=6><img id="tabImg" width="100px"></img></td>
                </tr>
                <tr>
                    <td><strong>Age: </strong>${players[id-1]["AGE"]}</td>
                </tr>
                <tr>
                    <td><strong>Assists: </strong>${players[id-1]["AST"].toFixed(1)}</td>
                </tr>
                <tr>
                    <td><strong>FG%: </strong>${players[id-1]["FG_"].toFixed(1)}%</td>
                </tr>
                <tr>
                    <td><strong>FT%: </strong>${players[id-1]["FT_"].toFixed(1)}%</td>
                </tr>
                <tr>
                    <td><strong>3P%: </strong>${players[id-1]["TP_"].toFixed(1)}%</td>
                </tr>         
            </table>
        </div>`
    )
    GetImage(player)
    $("#hoverTab").css('left',`${x}px`);
    $("#hoverTab").css('top',`${y}px`);
    $("#tab").fadeIn(200);
}

function GetImage(playerName){
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        dataType: "jsonp",
        data: {
            action: 'query', 
            titles: playerName, 
            format: 'json',
            prop: 'pageimages'
        },
        success: function(data) {
            var result = [];
            data = data["query"]["pages"]
            for(var i in data){
                result.push([i, data [i]]);
            }
            try {
                src = result["0"]["1"]["thumbnail"]["source"];
                var src1 = src.slice(0,47)
                var src2 = src.slice(53,src.lastIndexOf("/"))
                src = src1 + src2
                $("#tabImg").attr("src",src)
            }
            catch (Error){
                $("#tabImg").attr("src","./headshot.png")
            }
        }
    })
}
function HideTab(){
    $("#tab").remove();
}

$(document).on("mouseenter", ".player", function() {
    var x = event.clientX; 
    var y = event.clientY;
    var id = this.id;
    hoverTimer = setTimeout(ShowTab, 600, id,x,y);
});

$(document).on("mouseleave",".player", function() {
    if (!$("#hoverTab").is(':hover')){
        clearTimeout(hoverTimer);
        HideTab();
    }
});