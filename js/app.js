// ======================================================
// JBricks
// app.js
// ======================================================

//======================================================
// CONFIGURAÇÃO
//======================================================

const API_URL = "https://script.google.com/macros/s/AKfycby44NWRJPl3Q_2ua0PdCmGcgrYu_Q65cLUN5t8xWBlhhoZm34MhoRgZ4H6x29Japfg/exec";

const WHATSAPP_GROUP = "https://chat.whatsapp.com/HOqwY4Jqjej0a8V2qS360o";

//======================================================
// ELEMENTOS
//======================================================

const form = document.getElementById("cadastroForm");

const nome = document.getElementById("nome");
const cpf = document.getElementById("cpf");
const telefone = document.getElementById("telefone");
const nascimento = document.getElementById("nascimento");

const aceite = document.getElementById("aceite");

const botao = document.getElementById("btnCadastrar");

const idadeErro = document.getElementById("idadeErro");

//======================================================
// MÁSCARA CPF
//======================================================

cpf.addEventListener("input", () => {

    let valor = cpf.value.replace(/\D/g, "");

    valor = valor.substring(0,11);

    valor = valor.replace(/(\d{3})(\d)/,"$1.$2");
    valor = valor.replace(/(\d{3})(\d)/,"$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/,"$1-$2");

    cpf.value = valor;

    validarFormulario();

});

//======================================================
// MÁSCARA TELEFONE
//======================================================

telefone.addEventListener("input",()=>{

    let valor = telefone.value.replace(/\D/g,"");

    valor = valor.substring(0,11);

    if(valor.length <= 10){

        valor = valor.replace(/(\d{2})(\d)/,"($1) $2");
        valor = valor.replace(/(\d{4})(\d)/,"$1-$2");

    }else{

        valor = valor.replace(/(\d{2})(\d)/,"($1) $2");
        valor = valor.replace(/(\d{5})(\d)/,"$1-$2");

    }

    telefone.value = valor;

    validarFormulario();

});

//======================================================
// EVENTOS
//======================================================

nome.addEventListener("input",validarFormulario);

nascimento.addEventListener("change",validarFormulario);

aceite.addEventListener("change",validarFormulario);
//======================================================
// VALIDA CPF
//======================================================

function cpfValido(cpfTexto){

    let cpf = cpfTexto.replace(/\D/g,"");

    if(cpf.length != 11)
        return false;

    if(/^(\d)\1+$/.test(cpf))
        return false;

    let soma = 0;

    for(let i=0;i<9;i++){

        soma += parseInt(cpf.charAt(i)) * (10-i);

    }

    let resto = (soma * 10) % 11;

    if(resto == 10)
        resto = 0;

    if(resto != parseInt(cpf.charAt(9)))
        return false;

    soma = 0;

    for(let i=0;i<10;i++){

        soma += parseInt(cpf.charAt(i)) * (11-i);

    }

    resto = (soma * 10) % 11;

    if(resto == 10)
        resto = 0;

    return resto == parseInt(cpf.charAt(10));

}

//======================================================
// MAIOR DE IDADE
//======================================================

function maiorDeIdade(){

    if(nascimento.value == "")
        return false;

    let hoje = new Date();

    let nasc = new Date(nascimento.value);

    let idade = hoje.getFullYear() - nasc.getFullYear();

    let mes = hoje.getMonth() - nasc.getMonth();

    if(mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())){

        idade--;

    }

    return idade >= 18;

}

//======================================================
// VALIDA FORMULÁRIO
//======================================================

function validarFormulario(){

    const idadeOk = maiorDeIdade();

    if(!idadeOk && nascimento.value != ""){

        idadeErro.style.display = "flex";

    }else{

        idadeErro.style.display = "none";

    }

    const telefoneOk =
        telefone.value.replace(/\D/g,"").length >= 10;

    const nomeOk =
        nome.value.trim().length > 5;

    const cpfOk =
        cpfValido(cpf.value);

    const aceiteOk =
        aceite.checked;

    botao.disabled = !(

        nomeOk &&
        cpfOk &&
        telefoneOk &&
        idadeOk &&
        aceiteOk

    );

}
//======================================================
// ENVIO DO FORMULÁRIO
//======================================================

form.addEventListener("submit", async function(e){

    e.preventDefault();

    // Abre uma aba em branco enquanto ainda é um clique do usuário
    const whatsappTab = window.open("", "_blank");

    botao.disabled = true;
    botao.innerHTML = "Enviando...";

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify({

                nome: nome.value.trim(),
                cpf: cpf.value,
                telefone: telefone.value,
                nascimento: nascimento.value

            })

        });

        const json = await response.json();

        if(json.success){

            form.reset();

            idadeErro.style.display = "none";

            validarFormulario();

            // Agora redireciona a aba já aberta           
            window.location.href = WHATSAPP_GROUP

            return;

        }

        // Se deu erro, fecha a aba em branco
        whatsappTab.close();

        alert(json.message);

        botao.disabled = false;

        botao.innerHTML = "<span>Finalizar Cadastro</span><span class='button-arrow'>➜</span>";

    }catch(erro){

        // Fecha a aba em branco
        whatsappTab.close();

        console.error(erro);

        alert("Não foi possível concluir o cadastro.");

        botao.disabled = false;

        botao.innerHTML = "<span>Finalizar Cadastro</span><span class='button-arrow'>➜</span>";

    }

});
