// isolando as variaveis, para que o usuario não altere no console
(function () {
  // mudando o document.queryselector por $
  const $ = (q) => document.querySelector(q);

  document.addEventListener("DOMContentLoaded", function () {
    let tab = document.querySelectorAll("td");
    for (let i = 0; i < tab.length; i++) {
      let tabela = tab[i];
      let oculta = document.querySelectorAll(".oculta");
      if (oculta) {
        tabela.parentNode.outerHTML = "";
      }
    }
  });
  function renderGarage() {
    const garage = getGarage();
    $("#garage").innerHTML = "";
    garage.forEach((c) => addCarToGarage(c));
  }

  // funcão de pesquisar carros  pelo nome dono placa senha ou marca 
  function renderGaragepesquisa() {
    const pesquisa = $("#ps").value;
    const garage2 = getGarage();
    $("#garage").innerHTML = "";
    garage2.forEach((o) => {
      if (
        pesquisa == o.name ||
        pesquisa == o.licence ||
        pesquisa == o.dono ||
        pesquisa == o.password
      ) {
        addCarToGarage(o);
      }
    });
  }
  $("#psb").addEventListener("click", (e) => {
    renderGaragepesquisa();
    $("#ps").value = "";
  });

  function addCarToGarage(car) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.licence}</td>  
            <td>${car.cargo}</td> 
            <td>${car.dono}</td> 
            <td>${car.entrada}</td>
            <td>${car.password}</td>         
            <td>
                <button class="delete">Retirar</button>
            </td>
            <td class="oculta">${car.entradaoculta}</td> 
        `;

    $("#garage").appendChild(row);
  }

  //criar senha para cada carro
  function Password() {
    let senhagerada;
    let senha = "012345aeiou";
    let senha2 = 8X;
    let senhaFinal = "";
    for (var i = 0; i < senha2; i++) {
      let numerosenha = Math.floor(Math.random() * senha.length);
      senhagerada = senhaFinal += senha.substring(numerosenha, numerosenha + 1);
    }
    return senhagerada;
  }

  // converte em horario mundial pra o javascript calcular em milesimo de sengundo

  function checkOut(info) {
    let inicio = info[7].textContent;
    let inicio2 = new Date(inicio);
    let fim = new Date();
    let resultado = fim - inicio2;
    let minu = resultado / 1000 / 60;
    let minutos = minu.toFixed();

    const transformar = (m) => {
      const hor = Math.floor(m / 60);
      const min = m % 60;
      const seg = Math.floor(Math.random() * 59);
      const formatHo = `00${hor}`.slice(-2);
      const formatmin = `00${min}`.slice(-2);
      const formatseg = `00${seg}`.slice(-2);
      return `${formatHo}:${formatmin}:${formatseg}`;
    };

    const licence = info[1].textContent;
    const msg = `O veículo ${
      info[0].textContent
    } de matrícula ${licence} ficou estacionado por ${transformar(
      minutos
    )}. \n PORFAVOR confirme NOVAMENTE os dados antes de Retirar. \n `;

    if (!confirm(msg)) return;

    const garage = getGarage().filter((c) => c.licence !== licence);
    localStorage.garage = JSON.stringify(garage);

    renderGarage();
  }
  // se esse localstorage de nome garafe existir, vamos pegar e trazer no formato json
  const getGarage = () =>
    localStorage.garage ? JSON.parse(localStorage.garage) : [];

  renderGarage();
  $("#send").addEventListener("click", (e) => {
    const name = $("#name").value;
    const licence = $("#licence").value;
    const cargo = $("#cargo").value;
    const dono = $("#dono").value;

    //pegando o tempo e tranformando em horario de MZ
    let data = new Date();
    let hora = String(data.getHours()).padStart(2, "0");
    let minu = String(data.getMinutes()).padStart(2, "0");
    let seg = String(data.getSeconds()).padStart(2, "0");
    let dia = String(data.getDate()).padStart(2, "0");
    let mes = String(data.getMonth() + 1).padStart(2, "0");
    let ano = data.getFullYear();
    let entrada =
      hora + ":" + minu + ":" + seg + " " + dia + "/" + mes + "/" + ano;
    let entradaoculta =
      ano +
      "-" +
      mes +
      "-" +
      dia +
      "T" +
      hora +
      ":" +
      minu +
      ":" +
      seg +
      "+02:00";
    let password = Password();

    // SE name, licence, cargo e dono forem false, vai dar o alert
    if (!name || !licence || !cargo || !dono) {
      alert("Os campos são obrigatórios.");
      return;
    }

    const car = {
      name,
      licence,
      cargo,
      dono,
      /*variaveis criadas com as funçoes */ entrada,
      password,
      entradaoculta,
    };

    const garage = getGarage();
    garage.push(car);

    // pegar todos objetos no garage e mostrar. salva em texto e retorna em json
    localStorage.garage = JSON.stringify(garage);
    // limpar sempre depois do clique
    addCarToGarage(car);
    $("#name").value = "";
    $("#licence").value = "";
    $("#cargo").value = "";
    $("#dono").value = "";
  });

  $("#garage").addEventListener("click", (e) => {
    if (e.target.className === "delete")
      checkOut(e.target.parentElement.parentElement.cells);
  });
})();
