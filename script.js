const btnCriar = document.querySelector('[data-btn="criar"]')
const btnsDelete = document.querySelectorAll('[data-btn="delete"]')
const btnsEditar = document.querySelectorAll('[data-btn="editar"]')
const dados = JSON.parse(localStorage.getItem('dados')) || {
    "total": 0,
    "divisoes": []
    // "total": 1624,
    // "divisoes": [{
    //         "nome": "metinha",
    //         "Porcentagem": 10
    //     },
    //     {
    //         "nome": "meta",
    //         "Porcentagem": 20
    //     },
    //     {
    //         "nome": "metona",
    //         "Porcentagem": 30
    //     },
    //     {
    //         "nome": "reserva",
    //         "Porcentagem": 50
    //     },
    // ]
}

const salvaLocalStorage = (nome, item) => {
    localStorage.setItem(nome, JSON.stringify(item))
}

const Random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gerar_cor = (opacidade = 1) => {
    let r = Math.floor(Random(0, 255))
    let g = Math.floor(Random(0, 255))
    let b = Math.floor(Random(0, 255))

    // return `rgba(${r}, ${g}, ${b}, ${opacidade})`
    return `${r} ${g} ${b}`
}

const criarCRUD = () => {
    const criar = () => {
        const [valorTotal, , nomeMeta, PorcentagemMeta] =
        document.querySelector('form').elements
        // const [valorTotal, , nomeMeta, PorcentagemMeta] = form

        const valores = {
            valorTotal: valorTotal.value,
            nomeMeta: nomeMeta.value,
            PorcentagemMeta: PorcentagemMeta.value
        }

        const piscar = (input) => {
            input.classList.add("pisca")
            setTimeout(() => {
                input.classList.remove("pisca")
            }, 1000)
        }

        if (!valores.valorTotal) {
            piscar(valorTotal)
            return
        }
        if (!valores.nomeMeta) {
            piscar(nomeMeta)
            return
        }
        if (!valores.PorcentagemMeta) {
            piscar(PorcentagemMeta)
            return
        }

        dados.total = valores.valorTotal
        const meta = {
            nome: valores.nomeMeta,
            Porcentagem: valores.PorcentagemMeta
        }
        dados.divisoes.push(meta)

        salvaLocalStorage('dados', dados)

        nomeMeta.value = ""
        PorcentagemMeta.value = ""
        console.log("meta salva com sucesso!!!")
    }

    const ler = () => {
        const fieldsetMetas = document.querySelector('[data-fieldsetMetas]')
        const [valorTotal, , nomeMeta, PorcentagemMeta] =
        document.querySelector('form').elements
        const { total, divisoes } = dados
        if(total !== 0) valorTotal.value = total

        
        const dFrag = document.createDocumentFragment()
        const divMetas = document.createElement("div")
        divMetas.setAttribute("class", "metas")
        divMetas.setAttribute("data-metas", "")
        fieldsetMetas.innerHTML = "<legend>Minhas metas</legend>"
        console.log(dFrag)
        divisoes.forEach((item) => {
            const { nome, Porcentagem } = item
            const cor = gerar_cor()
            const porcent = (Porcentagem/100)*total
            divMetas.innerHTML += `

			<div class="card" data-card>
				<div class="expand">
					<span class="material-symbols-outlined btn" data-btn="expand">expand_more</span>
					<button class="material-symbols-outlined btn editar" data-btn="editar" title="Editar meta">edit_note</button>
					<button class="material-symbols-outlined btn delete" data-btn="delete" title="Apagar meta">delete</button>
				</div>
				<div class="meta">
					<div class="infos">
						<h3>${nome}</h3>
						<span>R$ ${porcent.toFixed(2)}</span>
						<small>${Porcentagem}%</small>
					</div>
					<div class="icon">
						<i style="background-color: rgba(${cor} /.2);color: rgba(${cor} /1);">${nome.charAt(0).toLocaleUpperCase()}</i>
					</div>
				</div>
			</div>
            `
            // console.log(item)
        })
        dFrag.appendChild(divMetas)

        fieldsetMetas.appendChild(dFrag)

        // console.log(divisoes)
    }

    return {
        ler,
        criar,
    }
}

const CRUD = criarCRUD()
CRUD.ler()

// console.log(dados.divisoes)

const criarMeta = (e) => {
    e.preventDefault()
    CRUD.criar()
    CRUD.ler()
}

btnCriar.addEventListener('click', criarMeta)

btnsDelete.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.parentNode.parentNode
        //card.remove()
        card.classList.add('animaApagar')
        setTimeout(() => {
            card.remove()
        }, 300)
    })
})

btnsEditar.forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log("editar")
    })
})



/* 
**crud**

    criar
    ler
    editar
    deletar
*/

/* 
dados : {
    Total : 1000
    Divisões : [
        {
            Nome: metinha
            Porcentagem : 25
        }, 
        {
            Nome: meta
            Porcentagem : 25
        }, 
        {
            Nome: metona
            Porcentagem : 25
        }, 
        {
            Nome: reserva
            Porcentagem : 25
        } 
    ]
}
*/

/*
<div class="card" data-card>
				<div class="del aberto">
					<button class="material-symbols-outlined btn-expand" data-btn="expand">expand_more</button>
					<button class="material-symbols-outlined btn-editar" data-btn="editar" title="Editar meta">edit_note</button>
					<button class="material-symbols-outlined btn-delete" data-btn="delete" title="Apagar meta">delete</button>
				</div>
				<div class="meta">
					<div class="infos">
						<h3>nome da meta</h3>
						<span>R$ 100.00</span>
						<small>10%</small>
					</div>
					<div class="icon">
						<i>N</i>
					</div>
				</div>
			</div>
*/