var adm_traffic = "https://dlinknctu.github.io/openadm/traffic.json";
var adm_clone =  "https://dlinknctu.github.io/openadm/clone.json";
var net_traffic = "https://dlinknctu.github.io/opennet/traffic.json";
var net_clone =  "https://dlinknctu.github.io/opennet/clone.json";
var mininet_traffic = "https://dlinknctu.github.io/mininet/traffic.json";
var mininet_clone =  "https://dlinknctu.github.io/mininet/clone.json";
var netChart = echarts.init(document.getElementById('opennet')); 
var admChart = echarts.init(document.getElementById('openadm'));  
var mininetChart = echarts.init(document.getElementById('mininetChart'));
var admTrafficObj = null;
var admCloneObj = null;
var netTrafficObj = null;
var netCloneObj = null;
var mininetTrafficObj = null;
var mininetCloneObj = null;
function parseDate(d) {
  return new Date(d*1000);
}
function OpenAdm() {
  
  $.ajax({
    type:'get',
    url:adm_traffic,    
 　　dataType:'text',
 　　success:function(msg){  
      admTrafficObj=JSON.parse(msg);   
      for(i=0;i<admTrafficObj.length;i++)
      {
        admTrafficObj[i]["bucket"] = parseDate(admTrafficObj[i]["bucket"]);
      }
      setData(admTrafficObj,admCloneObj,admChart);      
 　  },
    error:function(){
      alert('error');  
    }  
  });
  $.ajax({
    type:'get',  
    url:adm_clone,    
    dataType:'text', 
    success:function(msg){  
      admCloneObj=JSON.parse(msg); 
      for(i=0;i<admCloneObj.length;i++)
      {
        admCloneObj[i]["bucket"] = parseDate(admCloneObj[i]["bucket"]);
      }
      setData(admTrafficObj,admCloneObj,admChart);
    }
  });
  var converter = new showdown.Converter();
  $.ajax({
      type:'get',
      url:"https://raw.githubusercontent.com/dlinknctu/OpenADM/master/README.md",
      dataType:'text',
      success:function(msg){
          document.getElementById("admReadme").innerHTML=converter.makeHtml(msg);
      }
  });
}
function OpenNet() {
  $.ajax({
    type:'get',  
    url:net_traffic,    
    dataType:'text', 
    success:function(msg){  
      netTrafficObj=JSON.parse(msg); 
      for(i=0;i<netTrafficObj.length;i++)
      {
        netTrafficObj[i]["bucket"] = parseDate(netTrafficObj[i]["bucket"]);
      }
      setData(netTrafficObj,netCloneObj,netChart);
    }
  });
  $.ajax({
    type:'get',  
    url:net_clone,    
    dataType:'text', 
    success:function(msg){  
      netCloneObj=JSON.parse(msg); 
      for(i=0;i<netCloneObj.length;i++)
      {
        netCloneObj[i]["bucket"] = parseDate(netCloneObj[i]["bucket"]);
      }
      setData(netTrafficObj,netCloneObj,netChart);
    }
  });
  var converter = new showdown.Converter();
  $.ajax({
      type:'get',
      url:"https://raw.githubusercontent.com/dlinknctu/OpenNet/master/README.md",
      dataType:'text',
      success:function(msg){
          document.getElementById("netReadme").innerHTML=converter.makeHtml(msg);
      }
  });
}
function Mininet() {
    $.ajax({
        type:'get',
        url:mininet_traffic,
        dataType:'text',
        success:function(msg){
            mininetTrafficObj=JSON.parse(msg);
            for(i=0;i<mininetTrafficObj.length;i++)
            {
                mininetTrafficObj[i]["bucket"] = parseDate(mininetTrafficObj[i]["bucket"]);
            }
            setData(mininetTrafficObj,mininetCloneObj,mininetChart);
        }
    });
    $.ajax({
        type:'get',
        url:mininet_clone,
        dataType:'text',
        success:function(msg){
            mininetCloneObj=JSON.parse(msg);
            for(i=0;i<mininetCloneObj.length;i++)
            {
                mininetCloneObj[i]["bucket"] = parseDate(mininetCloneObj[i]["bucket"]);
            }
            setData(mininetTrafficObj,mininetCloneObj,mininetChart);
        }
    });
    var converter = new showdown.Converter();
    $.ajax({
        type:'get',
        url:"https://raw.githubusercontent.com/dlinknctu/mininet/master/README.md",
        dataType:'text',
        success:function(msg){
            document.getElementById("mininetReadme").innerHTML=converter.makeHtml(msg);
        }
    });
}
function setData(jsonTrafficData,jsonCloneData,myChart) {
  option = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:[{
          name:'Visitor',
          textStyle:{fontSize:"18", color:'gray'}
        },{
          name:'Clone',
          textStyle:{fontSize:"18", color:'gray'}
        }]
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataZoom : {show: true},
            dataView : {show: true},
            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : false,
    dataZoom : {
        show : true,
        realtime : true,
        start : 0,
        end : 100
    },
    xAxis : [
        {
            axisLabel : {
              textStyle:{fontSize:"18",color:'gray'}
            },
            type : 'category',
            boundaryGap : false,
            data : function (){
                var list = [];
                var temp = jsonTrafficData;
                if(jsonTrafficData == null)
                  temp = jsonCloneData;
                for (i = 0; i < temp.length; i++) {
                    d = temp[i]["bucket"];
                    list.push(d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate());
                }
                return list;
            }()
        }
    ],
    yAxis : [
        {
            splitLine : {
              show : false
            },
            axisLabel : {
              textStyle:{fontSize:"18",color:'gray'}
            },
            type : 'value',
            position: 'left',
            name:'Visitor',
            nameTextStyle:{fontSize:"20"}            
        },
        {
            splitLine : {
              show : false
            },
            axisLabel : {
              textStyle:{fontSize:"18",color:'gray'}
            },
            type : 'value',
            position: 'right',
            name:'Clone',
            nameTextStyle:{fontSize:"20"}
        }
    ],
    series : [
        {
            name:'Visitor',
            type:'line',
            data:function (){
                var list = [];
                temp = 0;               
                if(jsonTrafficData == null)
                  return list; 
                for (i = 0; i < jsonTrafficData.length; i++) {
                    d = temp + jsonTrafficData[i]["total"];
                    temp = d;
                    list.push(d);
                }
                return list;
            }()
        },
        {
            name:'Clone',
            type:'line',
            yAxisIndex: 1,
            data:function (){
                var list = [];
                temp = 0;
                if(jsonCloneData == null)
                  return list;
                for (i = 0; i < jsonCloneData.length; i++) {
                    d = temp + jsonCloneData[i]["total"];
                    temp = d ;
                    list.push(d);
                }
                return list;
            }()
        }
    ]
  };
  myChart.setOption(option);
  myChart.setTheme("default");
  return true;
}       
$(document).ready(function() {
  OpenAdm();
  OpenNet();
  Mininet();  
});
$('#tabNet a').click(function (e) {
  setTimeout(function(){
    netChart.resize();
    setData(netTrafficObj,netCloneObj,netChart);
  },100);
  

});
$('#tabAdm a').click(function (e) {
  setTimeout(function(){
    admChart.resize();
    setData(admTrafficObj,admCloneObj,admChart);
  },100);
});
$('#tabMininet a').click(function (e) {
    setTimeout(function(){
        mininetChart.resize();
        setData(mininetTrafficObj,mininetCloneObj,mininetChart);
    },100);
});
window.onresize = function(event) {
    admChart.resize();
    netChart.resize();
    mininetChart.resize();
};