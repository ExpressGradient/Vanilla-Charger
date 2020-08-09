// Start building your app from here..
import { hook, statefulHook, inject, conditionalHook, store, conditionalStore, loopHook, asyncStore, asyncHook, reactiveFunction } from './Vanilla-Charger.js';

const changeLogger = () => console.log('Hello World');
reactiveFunction(changeLogger);

export const firstname = "Express";
export const lastname = "Gradient";
const heading = hook("h1");
const paragraph = hook("p");

const component = hook(".component");
const renderDiv = hook("#render-div");

inject(component, renderDiv);

export let count = store(0);
const counter = statefulHook("#counter", count);
const button = hook(".increment-button");
button.addEventListener("click", () => {
    count["value"]++;
});

export let name = store("");
let textDisplay = statefulHook("#textDisplay", name);
let input = hook("input");
input.value = name["value"]
input.addEventListener("input", (event) => {
    name["value"] = event.target.value;
});

let truthBlock = hook('.truth-block');
let falseBlock = hook('.false-block')

export let condition = conditionalStore(false);
let conditionalBlock = conditionalHook(".conditional-block", condition, truthBlock, falseBlock);
let conditionalButton = hook(".conditional-button");
conditionalButton.addEventListener("click", () => condition.condition = !condition.condition);

let fruits = ['Apple', 'Mango', 'Orange', 'Banana', 'Grape'];
let loopBlock = loopHook('.loop-block', fruits);
let loopItems = document.getElementsByClassName('item');
loopItems = [...loopItems];
loopItems.forEach((item, index) => item.onclick = () => window.alert(`You have clicked ${fruits[index]}`));

export let asyncData = asyncStore("");
setTimeout(() => {
    asyncData.value = "This data comes late";
}, 2000);
let asyncBlock = asyncHook('.async-block', asyncData, '.placeHolder', '.async-item');
