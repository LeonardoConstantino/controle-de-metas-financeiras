const btnCriar = document.querySelector('[data-btn="criar"]')
const btnsDelete = document.querySelectorAll('[data-btn="delete"]')
const btnsEditar = document.querySelectorAll('[data-btn="editar"]')
let iniciou = true
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

const gerar_cor = () => {
    let r = Math.floor(Random(0, 255))
    let g = Math.floor(Random(0, 255))
    let b = Math.floor(Random(0, 255))

    // return `rgba(${r}, ${g}, ${b}, ${opacidade})`
    return `${r} ${g} ${b}`
}

const criarCRUD = () => {
    const criar = () => {
        const [valorTotal, , nomeMeta, PorcentagemMeta, cor,] =
        document.querySelector('form').elements

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

        dados.total = valorTotal.value
        const meta = {
            nome: nomeMeta.value,
            Porcentagem: PorcentagemMeta.value,
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
                cor
            } = item
            const porcent = (Porcentagem / 100) * total
            const divCard = document.createElement("div")
            const divExpand = document.createElement("div")
            const divMeta = document.createElement("div")
            const btnEditar = document.createElement("button")
            const btnDelete = document.createElement("button")
            const ultimoItem = index + 1 == array.length
            const camposPreenchidos = nomeMeta.value !="" && PorcentagemMeta.value !=""

            divCard.setAttribute("class", "card")
            if(iniciou){
                divCard.classList.add("swashIn")
                divCard.style.animationDelay = `.${1+index}s`
            }
            if(ultimoItem && camposPreenchidos){
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
                <div class="infos">
                    <h3>${nome}</h3>
                    <span>R$ ${porcent.toFixed(2)}</span>
                    <small>${Porcentagem}%</small>
                </div>
                <div class="icon">
                    <i style="background-color: rgba(${cor} /.2);color: rgba(${cor} /1);">${nome.charAt(0).toLocaleUpperCase()}</i>
                </div>
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

//Array.from(document.querySelectorAll('small')).reduce((acc, cur)=>acc + Number(cur.innerText.replace('%', '')), 0)

let frase = [
	{
		"autor": "Michael John Bobak",
		"frase": "Todo processo acontece fora da zona de conforto."
	},
	{
		"autor": "Henrique Carvalho",
		"frase": "A maioria das dicas que você recebe do seu gerente de banco ou fóruns de investimentos refletem o interesse deles, não os seus."
	},
	{
		"autor": "Douglas Gonçalves",
		"frase": "Aprender a controlar seu orçamento é o modo mais prático de cortar gastos e começar a investir."
	},
	{
		"autor": "Benjamin Franklin",
		"frase": "Investir em conhecimento rende sempre os melhores juros."
	},
	{
		"autor": "Michael Batnick",
		"frase": "Evitar erros catastróficos é mais importante do que construir o portfólio perfeito."
	},
	{
		"autor": "Michael Kitces",
		"frase": "Invista pensando no longo prazo, não especule, mas, não ignore as flutuações do mercado."
	},
	{
		"autor": "Dale Carnegie",
		"frase": "Em vez de se preocupar com o que as pessoas dizem sobre você, por que não investir tempo tentando fazer algo que elas admirem?"
	},
	{
		"autor": "Rafael Seabra",
		"frase": "Depois que você tem uma base sólida de conhecimento, fica muito mais fácil aprender a investir e lidar com dinheiro."
	},
	{
		"autor": "Steve Siebold",
		"frase": "A maneira mais rápida de ganhar dinheiro é resolver um problema. Quanto maior for o problema a resolver, mais dinheiro que você vai ganhar."
	},
	{
		"autor": "Will Smith",
		"frase": "Dinheiro e sucesso não mudam as pessoas, eles só ampliam o que já está lá."
	},
	{
		"autor": "Augusto Cury",
		"frase": "Você precisa conquistar aquilo que o dinheiro não compra. Caso contrário, será um miserável, ainda que seja um milionário."
	},
	{
		"autor": "Ayn Rand",
		"frase": "Dinheiro é apenas uma ferramenta. Ele irá levá-lo onde quiser, mas não vai substituí-lo como motorista."
	},
	{
		"autor": "Benjamin Franklin",
		"frase": "Se você almeja ser rico, pense em poupar assim como você pensa em ganhar dinheiro."
	},
	{
		"autor": "Warren Buffet",
		"frase": "Risco vem de você não saber o que está fazendo. Controle o seu dinheiro."
	},
	{
		"autor": "Thomas Jefferson",
		"frase": "Jamais gaste seu dinheiro antes de você possuí-lo."
	},
	{
		"autor": "Harry F. Banks",
		"frase": "Para o sucesso, atitude é igualmente tão importante quanto capacidade."
	},
	{
		"autor": "Robert Collier",
		"frase": "Sucesso é a soma de pequenos esforços, repetidos o tempo todo."
	},
	{
		"autor": "Confúcio",
		"frase": "A diferença entre um homem de sucesso e outro orientado para o fracasso é que um está aprendendo a errar, enquanto o outro está procurando aprender com seus próprios erros."
	},
	{
		"autor": "Henry David Thoreau",
		"frase": "O sucesso vem geralmente àqueles que estão muito ocupados para estar procurando por ele."
	},
	{
		"autor": "William Feather",
		"frase": "Sucesso parece ser, em grande parte, uma questão de continuar depois que outros desistiram."
	},
	{
		"autor": "Virgílio",
		"frase": "O sucesso encoraja-os: eles podem porque pensam que podem."
	},
	{
		"autor": "Frank Lloyrd Wright",
		"frase": "Eu sei o preço do sucesso: dedicação, trabalho duro, e uma incessante devoção às coisas que você quer ver acontecer."
	},
	{
		"autor": "Thomas J Stanley",
		"frase": "Antes de se tornar um milionário, você deve aprender a pensar como tal. Aprenda a se motivar para combater o medo com coragem."
	},
	{
		"autor": "Renan Bride de Oliveira",
		"frase": "Planejamento, organização e motivação são fatores essenciais para a prosperidade."
	},
	{
		"autor": "Jim Ryun",
		"frase": "Motivação é aquilo que te faz começar. Hábito é aquilo que te faz continuar."
	},
	{
		"autor": "John Jacob Astor",
		"frase": "A riqueza é o resultado dos seus hábitos diários."
	},
	{
		"autor": "Aristóteles",
		"frase": "Nós somos aquilo que fazemos repetidamente. Excelência, então, não é um modo de agir, mas um hábito."
	},
	{
		"autor": "Aristóteles",
		"frase": "O que sabemos aprendemos fazendo."
	},
	{
		"autor": "Ayn Rand",
		"frase": "Um homem criativo é motivado pelo desejo de alcançar, não pelo desejo de vencer os outros."
	},
	{
		"autor": "Platão",
		"frase": "Tente mover o mundo – o primeiro passo será mover a si mesmo."
	},
	{
		"autor": "Jufras Menhal",
		"frase": "Trate bem as oportunidades. Elas são reservadas e não aparecem pra qualquer um; algumas se ofendem fácil e podem nunca mais voltar."
	},
	{
		"autor": "Albert Einstein",
		"frase": "A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original."
	},
	{
		"autor": "Henry Ford",
		"frase": "O insucesso é uma oportunidade para recomeçar com mais inteligência."
	},
	{
		"autor": "Roger Crawford",
		"frase": "Ter problemas na vida é inevitável, ser derrotado por eles é opcional."
	},
	{
		"autor": "Nelson Mandela",
		"frase": "Tudo é considerado impossível até acontecer."
	},
	{
		"autor": "Rui Barbosa",
		"frase": "A diferença entre o inteligente e o sábio, é que o sábio pensa a longo prazo."
	},
	{
		"autor": "Epicuro",
		"frase": "A verdadeira riqueza não consiste em ter grandes posses, mas em ter poucas necessidades."
	},
	{
		"autor": "Benjamin Franklin",
		"frase": "Cuidado com as pequenas despesas. Um pequeno vazamento afundará um grande navio."
	},
	{
		"autor": "Warren Buffet",
		"frase": "Risco vem de você não saber o que está fazendo."
	},
	{
		"autor": "Thomas Jefferson",
		"frase": "Jamais gaste seu dinheiro antes de você possuí-lo."
	},
	{
		"autor": "Lao Tzu",
		"frase": "Uma jornada de mil quilômetros precisa começar com um simples passo."
	}
]