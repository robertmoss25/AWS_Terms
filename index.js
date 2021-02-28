var arrHead = new Array();
arrHead = ['AWS Component', 'URL', 'Module', 'Comment', 'Blurb', 'See Also']; // table headers.
arrHeadStyle= ['widthsmall', 'widthtiny', 'widthtiny', 'widthmedium', 'widthlarge','widthsmall'];
arrColumnNames = ['AWSComponent', 'URL', 'Module', 'Comment', 'Blurb', 'SeeAlso']

let questions = [];
let moduleList = [];
let filter = 'All';
let summaries = [];

function createHeader() {
    var empTable = document.getElementById('thehead');
    var tr = document.createElement("tr");
    tr.classList.add('d-flex');
    tr.classList.add('trcolor');
    for (var h = 0; h < arrHead.length; h++) {
        if (h != 1)
        {
            var th = document.createElement('th'); // the header object.
            th.classList.add(arrHeadStyle[h]);
            th.innerHTML = arrHead[h];
            tr.appendChild(th);
        }
    }
    empTable.appendChild(tr);
}

function handleChange() {
    d = document.getElementById("modules").value;
    filter = d;
    localStorage.setItem('filter', d);
    window.location.reload(); 
}

function loadSummaries()
{
    fetch("awssummary.json")
    .then(res => {
        return res.json();
    }).then(loadedSummary => {
        var body = document.getElementById('loadSummary');
        summaries = loadedSummary;
        availablesummaries = [...summaries];
        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        var tr = document.createElement("tr");
        tr.classList.add('d-flex');
        tr.classList.add('trcolor');
        var th = document.createElement('th'); // the header object.
        th.innerHTML = "Component";
        var th2 = document.createElement('th'); // the header object.
        th2.innerHTML = "Explanation";
        tr.appendChild(th);
        tr.appendChild(th2);
        thead.appendChild(tr);
        for (let index = 0; index < availablesummaries.length; index++) {
            const element = availablesummaries[index];
            const element2 = element["Summaries"];
            const moduleName = element["Module"];
            if (moduleName == filter)
            {
                let myKey = 'key';
                let myValue = 'value';
                let bOdd = true;
                for (let index2 = 1; index2 <= element2.length; index2++) {
                    var tr = document.createElement("tr");
                    var td1 = document.createElement('td'); // the header object.
                    var td2 = document.createElement('td'); // the header object.
                    let keyToFind = myKey+index2;
                    let valueToFind = myValue+index2;
                    const element3 = element2[index2-1][keyToFind];
                    const element4 = element2[index2-1][valueToFind];

                    td1.innerHTML = element3;
                    td1.classList.add('colOne');
                    td2.innerHTML = element4;
                    td2.classList.add('colTwo');

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    if (bOdd)
                    {
                        tr.classList.add('odd');
                        bOdd = false;
                    }
                    else
                    {
                        tr.classList.add('even');
                        bOdd = true;
                    }

                    tbody.appendChild(tr);

                    ////console.log(element3 + ":" + element4);  
                    ////var li = document.createElement("li");
                    ////li.innerHTML = '<strong>' + element3 + '</strong>' + ':' + element4;
                    ////body.appendChild(li);
                }
            }
        }
        table.appendChild(thead);
        table.appendChild(tbody);
        body.appendChild(table);
        var br = document.createElement("br");
        body.appendChild(br);
    }).catch(err => {
        console.error(err);
    });
}


function createBody() {
    filter = localStorage.getItem('filter');
    var summarybutton = document.getElementById('summarybutton');
    summarybutton.innerHTML = "Summary " + filter;
    if (filter == null)
        filter = 'All';
    fetch("awsterms.json")
    .then(res => {
        return res.json();
    }).then(loadedQuestions => {
        questions = loadedQuestions;
        availableQuestions = [...questions];
        var dropdown = document.getElementById('modules');
        var body = document.getElementById('thebody');
        let currentColor = 'info';
        for (let index = 0; index < availableQuestions.length; index++) {
            const element = availableQuestions[index];
            if (filter === 'All' || element["Module"] === filter)
            {            
                var tr = document.createElement("tr");
                tr.setAttribute('id', '#' + element[arrColumnNames[0]]);
                for (var h = 0; h < arrHead.length; h++) 
                {
                    if (h != 1)
                    {
                        var th = document.createElement('td'); // the header object.
                        if (h != 0 && h != 5)
                        {
                            th.innerHTML = element[arrColumnNames[h]];
                        }
                        else
                        {
                            if (h == 0)
                            {
                                // Create anchor element. 
                                var a = document.createElement('a');  
                                // Create the text node for anchor element. 
                                var link = document.createTextNode(element[arrColumnNames[h]]); 
                                // Append the text node to anchor element. 
                                a.appendChild(link);  
                                // Set the title. 
                                a.title = element[arrColumnNames[h]];  
                                // Set the href property. 
                                a.href = element["URL"];
                                a.target = "_blank";
                                th.appendChild(a);
                            }
                            else
                            {
                                if (element["SeeAlso"].length > 0)
                                {
                                    var stringsplit2 = element["SeeAlso"];
                                    let stringsplit = stringsplit2.split(",");
                                    for (let index = 0; index < stringsplit.length; index++) {
                                        const element2 = stringsplit[index];
                                        // Create anchor element. 
                                        var a = document.createElement('a');  
                                        // Create the text node for anchor element. 
                                        var link = document.createTextNode(element2); 
                                        // Append the text node to anchor element. 
                                        a.appendChild(link);  
                                        // Set the title. 
                                        a.title = element2;  
                                        // Set the href property. 
                                        a.href = "##" + element2.trim();
                                        var hr = document.createElement("br");
                                        th.appendChild(a);
                                        th.appendChild(hr);
                                    }
                                }
                            }
                        }
                        tr.appendChild(th);
                    }
                }
                tr.classList.add(currentColor);
                if (currentColor == 'info')
                {
                    currentColor = 'success';
                }
                else
                {
                    currentColor = 'info';
                }
                body.appendChild(tr);
            }   
        }

        for (let index = 0; index < availableQuestions.length; index++) {
            const element = availableQuestions[index];
            moduleList.push(element["Module"]);
        }
        let distinctList = [...new Set(moduleList)];
        distinctList.sort();
        distinctList.unshift('All');
        distinctList.unshift('Please Select');
        for (let index = 0; index < distinctList.length; index++) {
            var option = document.createElement("option");
            option.text = distinctList[index];
            dropdown.add(option);
        }

        d = document.getElementById("modules");
        d.value = filter;

    }).catch(err => {
        console.error(err);
    });
}

function createTable() {
    ////var empTable = document.getElementById('mytable');
    ////empTable.setAttribute('id', 'myTable');  // table id.

    ////var tr = empTable.insertRow(-1);
    ////tr.classList.add('d-flex');
    ////tr.classList.add('trcolor');

    // for (var h = 0; h < arrHead.length; h++) {
    //     var th = document.createElement('th'); // the header object.
    //     th.classList.add(arrHeadStyle[h]);
    //     th.innerHTML = arrHead[h];
    //     tr.appendChild(th);
    // }

    
    

    // var div = document.getElementById('cont');
    // div.appendChild(empTable);    // add table to a container.
}

////createTable();

// const data = document.getElementById("thebody");

// const table = document.getElementById("mytable");

// var row = table.insertRow(0);

// var cell1 = row.insertCell(0);
// var cell2 = row.insertCell(1);
// var cell3 = row.insertCell(2);
// var cell4 = row.insertCell(3);

// cell1.innerHTML = "Auto Scaling Group (ASG)";

// var myTr = document.createElement("tr");
// myTr.classList.add("info");

// var myTd1 = document.createElement("td");
// myTd1.innerText="Auto Scaling Group (ASG)";

// myTr.appendChild(myTd1);

// var myTd2 = document.createElement("td");
// myTd2.innerText="TBD";

// myTr.appendChild(myTd2);

// var myTd3 = document.createElement("td");
// myTd3.innerText="Offers easy horizontal scaling of compute capacity";

// myTr.appendChild(myTd3);

// var myTd4 = document.createElement("td");
// myTd4.innerText="AWS Auto Scaling monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost. Using AWS Auto Scaling, it’s easy to setup application scaling for multiple resources across multiple services in minutes. The service provides a simple, powerful user interface that lets you build scaling plans for resources including Amazon EC2 instances and Spot Fleets, Amazon ECS tasks, Amazon DynamoDB tables and indexes, and Amazon Aurora Replicas. AWS Auto Scaling makes scaling simple with recommendations that allow you to optimize performance, costs, or balance between them. If you’re already using Amazon EC2 Auto Scaling to dynamically scale your Amazon EC2 instances, you can now combine it with AWS Auto Scaling to scale additional resources for other AWS services. With AWS Auto Scaling, your applications always have the right resources at the right time.";

// myTr.appendChild(myTd4);

// document.body.appendChild(myTr);

