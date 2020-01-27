'use strict';

let ef = document.getElementById('dynfill');

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({timelines: []}, function() {
    console.log("Timelines array created");
  });
  chrome.storage.sync.set({starts: []}, function() {
    console.log("Starts array created");
  });
  chrome.storage.sync.set({ends: []}, function() {
    console.log("Ends array created");
  });
  chrome.storage.sync.set({events: []}, function() {
    console.log("Events array created");
  });
  chrome.storage.sync.set({deadlines: []}, function() {
    console.log("Deadlines array created");
  });
  chrome.storage.sync.set({event_timelines: []}, function() {
    console.log("Event timelines array created");
  });
  chrome.storage.sync.set({min: 10000}, function() {
    console.log("min 10000");
  });
  chrome.storage.sync.set({max: -50}, function() {
    console.log("max -50");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({})
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});
