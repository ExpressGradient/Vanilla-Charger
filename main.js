// Start building your app from here..
import { hook, statefulHook, inject, conditionalHook, store, conditionalStore } from './power.js';

const firstname = "Express";
const lastname = "Gradient";
let count = store(0);
let name = store("");
let condition = conditionalStore(false);

export const data = { firstname, lastname, count, name, condition };

const heading = hook("h1");
const paragraph = hook("p");

const component = hook(".component");
const renderDiv = hook("#render-div");

inject(component, renderDiv);

const counter = statefulHook("#counter", count);

const button = hook(".increment-button");

button.addEventListener("click", () => {
    count["value"]++;
});

let textDisplay = statefulHook("#textDisplay", name);
let input = hook("input");
input.value = name["value"]

input.addEventListener("input", (event) => {
    name["value"] = event.target.value;
});

let truthBlock = hook('.truth-block');
let falseBlock = hook('.false-block')

let conditionalBlock = conditionalHook(".conditional-block", condition, truthBlock, falseBlock);

let conditionalButton = hook(".conditional-button");

conditionalButton.addEventListener("click", () => condition.condition = !condition.condition);
