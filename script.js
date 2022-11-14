import {
    frases
} from "./frases.js"
const btnCriar = document.querySelector('[data-btn="criar"]')
let iniciou = true
const dados = JSON.parse(localStorage.getItem('dados')) || {
    "total": 0,
    "divisoes": []
}

const salvaLocalStorage = (nome, item) => {
    localStorage.setItem(nome, JSON.stringify(item))
    gerarGrafico()
    infos()
}

const Random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gerar_cor = () => {
    let r = Math.floor(Random(0, 255))
    let g = Math.floor(Random(0, 255))
    let b = Math.floor(Random(0, 255))

    return `${r} ${g} ${b}`
}

const criarCRUD = () => {
    const criar = () => {
        const [valorTotal, , nomeMeta, PorcentagemMeta, cor] =
        document.querySelector('form').elements
        const dataCriacao = new Intl
            .DateTimeFormat('pt-Br', {
                dateStyle: 'short',
                timeStyle: 'short'
            })
            .format(new Date())

        const piscar = (input) => {
            input.classList.add("pisca")
            setTimeout(() => {
                input.classList.remove("pisca")
            }, 1000)
        }

        if (!valorTotal.value) {
            piscar(valorTotal)
            return
        }
        if (!nomeMeta.value) {
            piscar(nomeMeta)
            return
        }
        if (!PorcentagemMeta.value) {
            piscar(PorcentagemMeta)
            return
        }

        dados.total = +valorTotal.value
        const meta = {
            nome: nomeMeta.value,
            Porcentagem: +PorcentagemMeta.value,
            data: dataCriacao,
            cor: cor.value ? cor.value : gerar_cor()
        }
        dados.divisoes.push(meta)

        salvaLocalStorage('dados', dados)

        nomeMeta.focus()
    }

    const ler = () => {
        const fieldsetMetas = document.querySelector('[data-fieldsetMetas]')
        const [valorTotal, , nomeMeta, PorcentagemMeta, corMeta] =
        document.querySelector('form').elements

        const {
            total,
            divisoes
        } = dados

        if (total !== 0) valorTotal.value = total

        const dFrag = document.createDocumentFragment()
        const divMetas = document.createElement("div")
        divMetas.setAttribute("class", "metas")
        divMetas.setAttribute("data-metas", "")
        fieldsetMetas.innerHTML = "<legend>Minhas metas</legend>"

        divisoes.forEach((item, index, array) => {
            const {
                nome,
                Porcentagem,
                data,
                cor
            } = item
            const porcent = (Porcentagem / 100) * total
            const divCard = document.createElement("div")
            const divExpand = document.createElement("div")
            const divMeta = document.createElement("div")
            const btnEditar = document.createElement("button")
            const btnDelete = document.createElement("button")
            const ultimoItem = index + 1 == array.length
            const camposPreenchidos = nomeMeta.value != "" && PorcentagemMeta.value != ""

            divCard.setAttribute("class", "card")
            if (iniciou) {
                divCard.classList.add("swashIn")
                divCard.style.animationDelay = `.${1+index}s`
            }
            if (ultimoItem && camposPreenchidos) {
                divCard.classList.add("swashIn")
            }

            divCard.setAttribute("data-card", "")
            divCard.appendChild(divExpand)

            btnEditar.setAttribute("class", "")
            btnEditar.setAttribute("data-btn", "editar")
            btnEditar.setAttribute("title", "Editar meta")
            btnEditar.classList.add("material-symbols-outlined", "btn", "editar")
            btnEditar.innerText = "edit_note"
            btnEditar.addEventListener('click', (e) => {
                const card = e.target.parentNode.parentNode

                nomeMeta.value = item.nome
                PorcentagemMeta.value = item.Porcentagem
                corMeta.value = item.cor

                array.splice(array.indexOf(item), 1)
                salvaLocalStorage("dados", dados)
                card.classList.add('tin')
                setTimeout(() => {
                    card.remove()
                }, 800)
            })

            btnDelete.setAttribute("class", "")
            btnDelete.setAttribute("data-btn", "delete")
            btnDelete.setAttribute("title", "Apagar meta")
            btnDelete.classList.add("material-symbols-outlined", "btn", "delete")
            btnDelete.innerText = "delete"
            btnDelete.addEventListener('click', (e) => {
                array.splice(array.indexOf(item), 1)
                salvaLocalStorage("dados", dados)
                const card = e.target.parentNode.parentNode
                card.classList.add('animaApagar')
                setTimeout(() => {
                    card.remove()
                }, 300)
            })

            divExpand.setAttribute("class", "expand")
            divExpand.innerHTML = `<span class="material-symbols-outlined btn" data-btn="expand">expand_more</span>`

            divMeta.setAttribute("class", "meta")
            divMeta.innerHTML = `
                <div>
                    <div class="infos">
                        <h3>${nome}</h3>
                        <span>R$ ${porcent.toFixed(2)}</span>
                        <small>${Porcentagem}%</small>
                    </div>
                    <div class="icon">
                        <i style="background-color: rgba(${cor} /.2);color: rgba(${cor} /1);">${nome.charAt(0).toLocaleUpperCase()}</i>
                    </div>
                </div>
                <small class="data-meta">${data}</small>
            `

            divMetas.appendChild(divCard)
            divCard.appendChild(divExpand)
            divExpand.appendChild(btnEditar)
            divExpand.appendChild(btnDelete)
            divCard.appendChild(divMeta)
        })

        dFrag.appendChild(divMetas)

        fieldsetMetas.appendChild(dFrag)
        iniciou = false

        nomeMeta.value = ""
        PorcentagemMeta.value = ""
        corMeta.value = ""
    }

    return {
        ler,
        criar,
    }
}

const CRUD = criarCRUD()
CRUD.ler()

const criarMeta = (e) => {
    e.preventDefault()
    CRUD.criar()
    CRUD.ler()
}

btnCriar.addEventListener('click', criarMeta)

const mudarFrase = () => {
    const blockquote = document.querySelector("blockquote")
    const faseAleatoria = Math.floor((Math.random() * frases.length))
    blockquote.innerHTML = `
    <p>"${frases[faseAleatoria].frase}"</p>
    <footer>
        <cite>${frases[faseAleatoria].autor}</cite>
    </footer>
    `
}
mudarFrase()

setInterval(mudarFrase, 60000)

const gerarGrafico = () => {
    const dom = document.querySelector('[data-grafico]');
    const myChart = echarts.init(dom, 'light', {
        renderer: 'canvas',
        useDirtyRect: false
    })

    const {
        total,
        divisoes
    } = dados

    const nomes = divisoes.map(nome => nome.nome)
    const valor = divisoes.map(Porcentagem => {
        const valor = (Porcentagem.Porcentagem / 100) * total
        return valor.toFixed(2)
    })

    const option = {
        xAxis: {
            type: 'category',
            data: ['total', ...nomes],
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            data: [total, ...valor],
            type: 'bar',
            label: {
                show: true
            }
        }]
    }

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }

    window.removeEventListener('resize', myChart.resize);
    window.addEventListener('resize', myChart.resize);
}
gerarGrafico()

const infos = () => {
    const cardInfo = document.querySelector('.card-info')
    const {
        total,
        divisoes
    } = dados
    if (divisoes.length == 0) {
        cardInfo.innerHTML = '<legend>Informações</legend><p>Sem informações</p>'
        return
    }
    const convertPorcent = (Porcentagem, total) => (Porcentagem / 100) * total
    const totalPorcentagem = divisoes.reduce((acc, cur) => acc + +cur.Porcentagem, 0)
    const menorMeta = divisoes.reduce((acc, cur) => (acc.Porcentagem > cur.Porcentagem) ? cur : acc) || 0
    const maiorMeta = divisoes.reduce((acc, cur) => (acc.Porcentagem < cur.Porcentagem) ? cur : acc) || 0
    const valorComprometido = (totalPorcentagem / 100) * total
    // console.log(menorMeta);
    cardInfo.innerHTML = `
    <legend>Informações</legend>
    <p>Valor comprometido: <span>R$ ${valorComprometido.toFixed(2)} de R$ ${total}</span></p>
    <p>Porcentagem comprometida: <span>${totalPorcentagem}%</span></p>
    <p>Maior meta: <span>${maiorMeta.nome} R$ ${convertPorcent(maiorMeta.Porcentagem, total).toFixed(2)}</span></p>
    <p>Menor meta: <span>${menorMeta.nome} R$ ${convertPorcent(menorMeta.Porcentagem, total).toFixed(2)}</span></p>
    `
}
infos()


/* 
**crud

    criar
    ler
    editar
    deletar
*/
