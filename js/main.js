const compose = (...functions) => (data) =>
  functions.reduceRight((value, func) => func(value), data);

//un ejemplo de como se va a ver el objeto abajo

// {
//   tag:'h1',
//   attr: {
//     class:'title'
//   },
// }

const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj)
  const attrs = []
  for (let i = 0; i < keys.length; i++) {
    let attr = keys[i]
    attrs.push(`${attr}="${obj[attr]}"`)
  }
  
  const string = attrs.join('')
  return string
}


//"tag = h1 class = "title""

const tagAttrs = obj => (content = "") => 
  `<${obj.tag}${obj.attrs ? ' ': ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`


const tag = t => { //modificar el tag arregla el error de undefinded, justamente porque no retornaba
  if(typeof (t) === 'string'){
    return tagAttrs({tag: t})
  }else{
    return tagAttrs(t)

  }
}

/* function tag(t){
  return function(content){
    return `<${t}>${content}</${t}>`
  }
} */

// se llama asi tag('h1')('Title') y devolveria <h1>Title</h1>

const tableRowTag = tag('tr')
//const tableRow = items => tableRowTag(tableCells(items))
const tableRow = items => compose(tableRowTag, tableCells)(items)


const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('') //aca no mostraba cuando pone la s


const trashIcon = tag({tag:'i',attrs:{class: 'fas fa-trash-alt'}})('')



let description = $("#description");
let carbs = $("#carbs");
let calories = $("#calories");
let protein = $("#protein");

let list = [];

description.keypress(() => {
  description.removeClass("is-invalid");
});
carbs.keypress(() => {
  carbs.removeClass("is-invalid");
});
calories.keypress(() => {
  calories.removeClass("is-invalid");
});
protein.keypress(() => {
  protein.removeClass("is-invalid");
});

const validateInputs = () => {
  /* if (description.val() === "") {
    description.addClass("is-invalid");
  } */
  //lo mismo que arriba pero usando un operador ternario

  description.val() ? "" : description.addClass("is-invalid");
  carbs.val() ? "" : carbs.addClass("is-invalid");
  calories.val() ? "" : calories.addClass("is-invalid");
  protein.val() ? "" : protein.addClass("is-invalid");

  if (description.val() && carbs.val() && calories.val() && protein.val()) {
    add();
  }
};

const add = () => {
  const newItem = {
    description: description.val(),
    carbs: parseInt(carbs.val()),
    calories: parseInt(calories.val()),
    protein: parseInt(protein.val()),
  };

  list.push(newItem);
  cleanInputs()
  updateTotals() //faltaba esto
  renderItems()
};


const updateTotals = ()=>{
  let calories = 0, carbs = 0, protein = 0

  list.map(item => {
    calories += item.calories, //y aca el += taba alreves
    carbs += item.carbs,
    protein += item.protein

  })

  $('#totalCalories').text(calories)
  $('#totalCarbs').text(carbs)
  $('#totalProtein').text(protein)

}

const cleanInputs = ()=>{
  description.val('')
  carbs.val('')
  calories.val('')
  protein.val('')
}

const renderItems = () =>{
  $('tbody').empty()

  list.map((item, index) => {

    const removeButton = tag({
      tag:'button',
      attrs:{
        class:'btn btn-outline-danger',
        onclick:`removeItem(${index})`
      }
    })(trashIcon)

    $('tbody').append(tableRow([item.description, item.calories, item.carbs, item.protein, removeButton]))
  })
}

const removeItem = (index) => {
  list.splice(index,1)
  updateTotals()
  renderItems()
}