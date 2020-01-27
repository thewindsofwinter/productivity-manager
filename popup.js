/*let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
};*/

// LOL THIS CODE IS ABSOLUTELY A MESS AN I AM SLEEP DEPRIVED LEZGO
let eventChange = document.getElementById('new_event');
let timelineChange = document.getElementById('new_timeline');

let tln = document.getElementsByName('New Timeline')[0];
let tls = document.getElementsByName('timeline_start')[0];
let tle = document.getElementsByName('timeline_end')[0];

let en = document.getElementsByName('New Event')[0];
let ed = document.getElementsByName('event_deadline')[0];
let ef = document.getElementById('dynfill');

let svg = document.getElementById('timelines');

timelineChange.onclick = function(element) {
    let name = tln.value;
    let start = tls.value;
    let end = tle.value;

    //console.log("1");

    chrome.storage.sync.get('timelines', function(item) {
        //console.log(item);
        item.timelines.push(name);
        //console.log(name + " added to timelines");
        //console.log(item);

        chrome.storage.sync.get('starts', function(item4) {
            item4.starts.push(parseInt(start));

            chrome.storage.sync.set(item4, function() {
                console.log("Starts now" + item4);

                chrome.storage.sync.get('ends', function(item3) {
                    item3.ends.push(parseInt(end));

                    chrome.storage.sync.set(item3, function() {
                        console.log("Ends now" + item3);
                        chrome.storage.sync.get('min', function(small) {
                            console.log(small.min);
                            chrome.storage.sync.set({min: Math.min(small.min, parseInt(start))}, function() {
                                console.log("Success minimum!");

                                chrome.storage.sync.get('max', function(big) {
                                    console.log(big.max);
                                    chrome.storage.sync.set({max: Math.max(big.max, parseInt(end))}, function() {
                                        console.log("Success maximum!");

                                        chrome.storage.sync.set(item, function() {
                                            console.log("Timelines now" + item);

                                            ef.innerHTML = '';
                                            svg.innerHTML = '';
                                            chrome.storage.sync.get('timelines', function(it2) {
                                                updateTimelines();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                        //console.log(end + " added to ends");
                });
            });
            //console.log(start + " added to starts");
        });
    });

}

runSVG = function() {
    chrome.storage.sync.get('events', function(a) {
        chrome.storage.sync.get('deadlines', function(b) {
            chrome.storage.sync.get('event_timelines', function(c) {
                chrome.storage.sync.get('timelines', function(it2) {
                    chrome.storage.sync.get('min', function(small) {
                        chrome.storage.sync.get('max', function(big) {
                            for(var i in a.events) {
                                console.log(c.event_timelines[i]);
                                let y = c.event_timelines[i]*200/(it2.timelines.length) + 4;
                                //xywh
                                console.log(i);

                                //console.log(start.starts[i] - small.min);
                                //console.log(big.max - small.min);
                                //console.log(end.ends[i] - start.starts);
                                //console.log(start.starts[i]);

                                let xleft = (b.deadlines[i] - small.min)*300/(big.max - small.min);
                                var j = document.createElementNS("http://www.w3.org/2000/svg", "circle");

                                j.setAttribute('cx', xleft + "px");
                                j.setAttribute('cy', y + "px");
                                j.setAttribute('r', "4px");
                                j.setAttribute('fill', "#ff0000")

                                svg.appendChild(j);
                            }
                        });
                    });
                });
            });
        });
    });
}

eventChange.onclick = function(element) {
    let name = en.value;
    let deadl = ed.value;
    let target = ef.value;

    chrome.storage.sync.get('timelines', function(item) {
        let index = item.timelines.indexOf(target);

        chrome.storage.sync.get('starts', function(it3) {
            chrome.storage.sync.get('ends', function(it2) {
                try {
                    if(target.length != 0 && parseInt(deadl) >= it3.starts[index]
                        && parseInt(deadl) <= it2.ends[index]) {

                        chrome.storage.sync.get('events', function(l) {
                            l.events.push(name);

                            chrome.storage.sync.set(l, function() {
                                console.log("Events now" + l);

                                chrome.storage.sync.get('deadlines', function(l2) {
                                    l2.deadlines.push(parseInt(deadl));

                                    chrome.storage.sync.set(l2, function() {
                                        console.log("Deadlines now" + l2);

                                        chrome.storage.sync.get('event_timelines', function(l3) {
                                            chrome.storage.sync.get('timelines', function(it2) {
                                                for(var i in it2.timelines) {
                                                    if(it2.timelines[i] == target) {
                                                        l3.event_timelines.push(parseInt(i));
                                                    }
                                                }

                                                chrome.storage.sync.set(l3, function() {
                                                    console.log("Event Timelines now" + l3);
                                                    runSVG();
                                                });
                                            });
                                        })
                                    });
                                });
                            });
                        })
                    }
                }
                catch(exception) {
                    console.log("Happened: " + exception);
                }
            })
        })

    })

}

updateTimelines = function() {
    chrome.storage.sync.get('timelines', function(it2) {
        console.log(it2.timelines);
        for (var i in it2.timelines) {
            var j = document.createElement("option");
            j.innerHTML = it2.timelines[i];
            j.value = it2.timelines[i];
            ef.appendChild(j);
        }

        chrome.storage.sync.get('min', function(small) {
            chrome.storage.sync.get('max', function(big) {
                if(small.min < big.max) {
                    chrome.storage.sync.get('starts', function(start) {
                        chrome.storage.sync.get('ends', function(end) {
                            for(var i in it2.timelines) {
                                let y = i*200/(it2.timelines.length);
                                // total 300 / max - min
                                console.log("IMPORATANT STATS");
                                console.log(start.starts);
                                console.log(end.ends);
                                console.log(small.min);
                                console.log(big.max);

                                //xywh
                                let xleft = (start.starts[i] - small.min)*300/(big.max - small.min);
                                let w = (end.ends[i] - start.starts[i])*300/(big.max - small.min);
                                var j = document.createElementNS("http://www.w3.org/2000/svg", "rect");

                                j.setAttribute('x', xleft + "px");
                                j.setAttribute('y', y + "px");
                                j.setAttribute('rx', "2px");
                                j.setAttribute('ry', "2px");
                                j.setAttribute('width', w + "px");
                                j.setAttribute('height', "8px");

                                j.setAttribute('fill', 'rgb(' + i*50 + ", 0, " + i*50 + ")");

                                svg.appendChild(j);
                            }
                        });
                    });
                }
            });
        });
    })
}

document.body.onload = function(element) {
    ef.innerHTML = '';
    svg.innerHTML = '';

    updateTimelines();

}
