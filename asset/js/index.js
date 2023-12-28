const myinput = document.getElementById('input')
const apiURL = 'https://mindicador.cl/api'
const myselect = document.getElementById('select')
const myconvert = document.getElementById('convert')
const myresult = document.getElementById('result')
const mygraph  = document.getElementById('graphic')
async function cargardata(){
    try{
        const res = await fetch(apiURL)
        const data = await res.json()
        const arrdata = Object.entries(data).splice(3,15)
        select(arrdata)
    }catch(e){
        alert(e.message)
    }
}

const convertir = async (unit) => {
    try{
        unidad = unit
        let resu = ''
        let calculator = parseInt(myinput.value)
        const money = await fetch(apiURL+'/'+unidad)
        const dsmoney = await money.json()
        arrmoney = (dsmoney.serie[0])       
        let valor = parseFloat(arrmoney.valor)
        let respuesta = new Intl.NumberFormat(["ban", "id"]).format(Math.round(valor * calculator))
        resu = `<p><h1 class="detalle">Resultado: $${respuesta}</h3></p>`
        myresult.innerHTML = resu
    }catch(e){
        alert(e.message)
    }
}

const select = (arrdata) => {
    try{
        let template = ''
        template = `<option>Seleccione moneda</option>`
        arrdata.forEach((val) =>{  
            template += `
            <option value = "${val[0]}">${val[0]}</option>`
        })
        myselect.innerHTML = template
        myselect.addEventListener('change',function(){
            let val1 = this.options[this.selectedIndex]
            conversor(val1.value)
        })
    }catch(e){
        alert(e.message)
    }
}

const conversor = (val1) =>{
    try{
        let val = val1
        myconvert.addEventListener('click',function(){
            convertir(val) 
            grafica(val) 
            mygraph.innerHTML = ''
        })
    }catch(e){
        alert(e.menssage)
    }
}

const getMonedas = async (val) => {
    let uni = val
    const respgraph = await fetch(apiURL+'/'+uni)
    const dsgraph = await respgraph.json()
    arrmonedas = dsgraph.serie
    return arrmonedas
}

const configGrafica = (arrmonedas) =>{
    const tipoDeGrafica = "line";
    const nombresDeLasMonedas = arrmonedas.slice(0,10).map((moneda) => moneda.fecha)
    const titulo = "Historial últimos 10 días"
    const colorDeLinea = "red"
    const valores = arrmonedas.slice(0,10).map((moneda) => {
        const valor = moneda.valor
        return Number(valor)
    })
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: nombresDeLasMonedas,
            datasets: [ {
                label: titulo,
                backgroundColor: colorDeLinea,
                borderColor: "rgba(255,0,0,0.5)",
                data: valores
            }
        ]}
    }
    return config;
}

const grafica = async (val) =>{
    let unidad = val
    const data = await getMonedas(unidad)
    const config = configGrafica(data)
    mygraph.classList.add('graph')
    new Chart(mygraph,config)
    template = `<option>Seleccione moneda</option>`
    myselect.innerHTML = template
    setInterval("location.reload()",9000)
}

cargardata()

