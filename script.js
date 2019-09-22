/* eslint-disable no-alert */

let clickIncrement = 1;
let priceMultiplier = 1.25;
let upgradeArr;
if (window.localStorage.upgrades.split(' ') !== undefined) {
  upgradeArr = window.localStorage.upgrades.split(' ');
} else {
  upgradeArr = [0, 0, 0];
}

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  const coffeeCount = document.getElementById('coffee_counter');
  coffeeCount.innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee += clickIncrement;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  for (let i in producers) {
    if (coffeeCount * 2 >= producers[i].price) {
      producers[i].unlocked = true;
    }
  }

}

function getUnlockedProducers(data) {
  // your code here
  const unlocked = [];
  for (let i in data.producers) {
    if (data.producers[i].unlocked) {
      unlocked.push(data.producers[i])
    }
  }
  return unlocked;
}

function makeDisplayNameFromId(id) {
  // your code here
  const words = id.split('_');
  for (let i in words) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }
  return words.join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
    <button type="button" id="sell${producer.id}">Sell</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  const childNodes = [...parent.childNodes];
  for (let i = 0; i < childNodes.length; i++) {
    parent.removeChild(childNodes[i])
  }
}

function renderProducers(data) {
  // your code here
  unlockProducers(data.producers, data.coffee);
  const unlockedProds = getUnlockedProducers(data);
  const producerContainer = document.getElementById('producer_container');
  deleteAllChildNodes(producerContainer);

  for (let i = 0; i < unlockedProds.length; i++) {
    producerContainer.appendChild(
      makeProducerDiv(unlockedProds[i]))
  }

}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let i in data.producers) {
    if (data.producers[i].id === producerId) {
      return data.producers[i];
    }
  }
}

function canAffordProducer(data, producerId) {
  // your code here
  if (getProducerById(data, producerId).price <= data.coffee) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  // your code here
  const indicator = document.getElementById('cps');
  indicator.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * priceMultiplier);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  const producer = getProducerById(data, producerId)
  if (canAffordProducer(data, producerId)) {
    data.coffee -= producer.price;
    producer.qty++;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  }
  return false;

}

function sellProducer(data, producerId) {
  // your code here
  const producer = getProducerById(data, producerId)
  data.coffee += producer.price / 2;
  producer.qty--;
  producer.price = Math.floor(producer.price / priceMultiplier);
  data.totalCPS -= producer.cps;
  return true;
}

function buyButtonClick(event, data) {
  // your code here
  const producerId = event.target.id.slice(4);
  if (event.target.tagName === 'BUTTON') {
    if (event.target.id.slice(0, 4) === 'buy_') {
        if (canAffordProducer(data, producerId)) {
          attemptToBuyProducer(data, producerId);
          renderProducers(data);
          updateCoffeeView(data.coffee);
          updateCPSView(data.totalCPS);
        } else {
          window.alert('Not enough coffee!')
        }
    }
    if (event.target.id.slice(0, 4) === 'sell') {
      sellProducer(data, producerId);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function upgradeClick(event, data) {
  // your code here
  const upId = event.target.id;
  if (upId === 'upClicks' && event.target.className === 'upgrade') {
    if (data.coffee >= 1000) {
      clickIncrement = 10;
      data.coffee -= 1000;
      event.target.className = 'purchased';
      upgradeArr[0] = 1;
    } else {
      window.alert('Not enough coffee!')
    }
  } else if (upId === 'upUpgrade' && event.target.className === 'upgrade') {
    if (data.coffee >= 10000) {
      priceMultiplier = 1.1;
      data.coffee -= 10000;
      event.target.className = 'purchased';
      upgradeArr[1] = 1;
    } else {
      window.alert('Not enough coffee!')
    }
  } else if (upId === 'upCPS' && event.target.className === 'upgrade') {
    if (data.coffee >= 100000) {
      data.totalCPS = Math.floor(data.totalCPS * 1.5);
      data.coffee -= 100000;
      event.target.className = 'purchased';
      upgradeArr[2] = 1;
    } else {
      window.alert('Not enough coffee!')
    }
  }
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS)
      storage.setItem('upgrades', upgradeArr.join(' '))
}

let storage = window.localStorage;
function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
  renderProducers(data);
  storage.setItem('coffee', data.coffee);
  storage.setItem('totalCPS', data.totalCPS);
  let producerArr = [];
  for (let i = 0; i < data.producers.length; i++) {
    for (let key in data.producers[i]) {
      producerArr.push(data.producers[i][key])
    }
    // producerArr.push(data.producers[i].id);
    // producerArr.push(data.producers[i].price);
    // producerArr.push(data.producers[i].unlocked);
    // producerArr.push(data.producers[i].cps);
    // producerArr.push(data.producers[i].qty);
  }
  storage.setItem('producersStr', producerArr.join(' '))


}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  const storage = window.localStorage;
  //***** load storage!! coerce text to nums
  if (storage.length > 0) {
    if (!isNaN(+storage.coffee)) {
      window.data.coffee = +window.localStorage.coffee;
    }
    if (!isNaN(+storage.coffee)) {
      window.data.totalCPS = +window.localStorage.totalCPS;
    }
    if (storage.upgrades) {
      let upgradeArr = storage.upgrades.split(' ');
      if (upgradeArr[0] === '1') {
        clickIncrement = 10;
        document.getElementById('upClicks').className = 'purchased';
      } else {
        upgradeArr[0] = '0';
      }
      if (upgradeArr[1] === '1') {
        priceMultiplier = 1.1;
        document.getElementById('upUpgrade').className = 'purchased';
      } else {
        upgradeArr[1] = '0';
      }
      if (upgradeArr[2] === '1') {
        document.getElementById('upCPS').className = 'purchased';
      } else {
        upgradeArr[2] = '0';
      }
    }
    const savedProducers = [];
    const producerFlat = window.localStorage.producersStr.split(' ');
    for (let i = 0; i < window.data.producers.length; i++) {
      let obj = {
        id: producerFlat[i * 5],
        price: +producerFlat[i * 5 + 1],
        unlocked: producerFlat[i * 5 + 2],
        cps: +producerFlat[i * 5 + 3],
        qty: +producerFlat[i * 5 + 4]
      }
      savedProducers.push(obj);
    }
    window.data.producers = savedProducers;
  }

  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  //add event listener to upgrades section
  const upgradeContainer = document.getElementById('upgrades');
  upgradeContainer.addEventListener('click', event => {
    upgradeClick(event, data);
  })
  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
