// ======================================================
// JBricks
// app.js
// ======================================================

//======================================================
// URL DA API
//======================================================

const API_URL = "https://script.google.com/macros/s/AKfycby67C-NagjvUjTi1t1cLGXYiGTK9GlH_cYPZgj6o41Xi20-xKFYaai0DN_rfC0KG84/exec";

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

    if(cpf.length != 11) return false;

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

    if(nascimento.value=="")
        return false;

    let hoje = new Date();

    let nasc = new Date(nascimento.value);

    let idade = hoje.getFullYear() - nasc.getFullYear();

    let mes = hoje.getMonth() - nasc.getMonth();

    if(
        mes < 0 ||
        (mes===0 && hoje.getDate()<nasc.getDate())
    ){

        idade--;

    }

    return idade >= 18;

}

//======================================================
// VALIDA FORMULÁRIO
//======================================================

function validarFormulario(){

    let idadeOk = maiorDeIdade();

    if(!idadeOk && nascimento.value!=""){

        idadeErro.style.display="flex";

    }else{

        idadeErro.style.display="none";

    }

    let telefoneOk =
        telefone.value.replace(/\D/g,"").length >= 10;

    let nomeOk =
        nome.value.trim().length > 5;

    let cpfOk =
        cpfValido(cpf.value);

    let aceiteOk =
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
// ENVIO
//======================================================

form.addEventListener("submit",async function(e){

    e.preventDefault();

    botao.disabled = true;

    botao.innerHTML = "Enviando...";

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify({

                nome:nome.value.trim(),

                cpf:cpf.value,

                telefone:telefone.value,

                nascimento:nascimento.value

            })

        });

        const json = await response.json();

        if(json.success){

            alert(json.message);

            form.reset();

            idadeErro.style.display="none";

            botao.innerHTML="<span>Finalizar Cadastro</span><span class='button-arrow'>➜</span>";

            validarFormulario();

        }else{

            alert(json.message);

            botao.disabled=false;

            botao.innerHTML="<span>Finalizar Cadastro</span><span class='button-arrow'>➜</span>";

        }

    }catch(erro){

        console.error(erro);

        alert("Não foi possível enviar o cadastro.");

        botao.disabled=false;

        botao.innerHTML="<span>Finalizar Cadastro</span><span class='button-arrow'>➜</span>";

    }

});