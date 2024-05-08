$(document).ready(function() {
   setTimeout(function() {
      $(".loader-pre").fadeOut(500);
   }, 1500);
   const sectionMessages = document.querySelector("#messages");
   const inputMessage = document.querySelector("#message");
   const buttonMessage = document.querySelector("#send-message");
   const formMessage = document.querySelector("form");
   var questaoContent = '';
   var Qatual = 1;
   var arrayResp = [];
   var arraySresp = [];
   var jaMarcou = 0;
   var XMLcontent = '';
   var ambiente = 0; //0 - criador de provas // 1 - realizador de provas
   var janela = 0; //0 - tela questionario // 1 - tela importador // 2 - popup avisos // 3 - popup importador
   $(".prova-individual").on("click", ".radio-alt, .alt-numero", function() {
      if ($(this).siblings(".alt-style").val().length > 0){		  
	  if (ambiente == 1) {
         $(this).parent('.cont-alt').parent('.questao').find(".alt-style").removeClass("gabarito");
         $(this).parent('.cont-alt').parent('.questao').find(".alt-numero").removeClass("gabarito");
         $(this).parent('.cont-alt').parent('.questao').find(".radio-alt").removeClass("gabarito");
         $(this).removeClass('errado').addClass('gabarito');
         $(this).siblings().removeClass('errado').addClass("gabarito");
      } else {
         $(this).parent('.cont-alt').parent('.questao').find(".alt-style").removeClass("gabarito").addClass('errado');
         $(this).parent('.cont-alt').parent('.questao').find(".alt-numero").removeClass("gabarito").addClass('errado');
         $(this).parent('.cont-alt').parent('.questao').find(".radio-alt").removeClass("gabarito").addClass('errado').html('X');
         if ($(this).hasClass("radio-alt")) {
            $(this).html('✔');
         } else {
            $(this).siblings('.radio-alt').html('✔');
         }
         $(this).removeClass('errado').addClass('gabarito');
         $(this).siblings().removeClass('errado').addClass("gabarito");
      }
      var gabAtual = parseInt($(this).parent().parent().attr('id').replace(/\D/g, ''));
      if (!arrayResp.includes(gabAtual)) {
         arrayResp.push(gabAtual);
		 console.log(arrayResp);
   }} else {console.log($(this).parent('.cont-alt').parent('.questao').find(".alt-style").val().length);}
   });
   $("#abreProva").click(function() {
      $('.blur-container, .importador-xml').fadeIn(500);
      $('.blur-container, .importador-xml').css({
         'animation': 'blowInContent 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
      });
      janela = 3;
   });

   function fechaImportador() {
      $('.blur-container, .importador-xml').fadeOut(500);
      $('.blur-container, .importador-xml').css({
         'animation': 'blowUpContent 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
      });
      janela = 0
   }

   function abreAviso(msgAviso) {
      $('#contentAviso').html(msgAviso);
      janela = 2;
      console.log('aviso');
      $('.blur-container, .avisos-gerais').fadeIn(500);
      $('.blur-container, .avisos-gerais').css({
         'animation': 'blowInContent 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
      });
   }

   function fechaAviso() {
      janela = 0;
      $('.blur-container, .avisos-gerais').fadeOut(500);
      $('.blur-container, .avisos-gerais').css({
         'animation': 'blowUpContent 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
      });
   }
   $("#fechaImportador").click(function() {
      fechaImportador()
   });
   $("#novaProva").click(function() {
      $('.prova-individual').fadeIn(500);
      $('.prova-individual').css({
         'animation': 'blowInContent 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
      });
      $('#aval-title').html('Cadastrar Nova Avaliação');
      $('#nome-prova').val('');
      geradorQuestoes();
      janela = 0;
   });

   function fechaProva() {
      $('.prova-individual').fadeOut(500);
      $('.wrap-questoes').empty();
      Qatual = 1;
      $('.prova-individual').css({
         'animation': 'blowUpContent 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
      });
      ambiente = 0;
   }
   $("#fechaProva").click(function() {
      fechaProva();
   });

function formatadorXML() {
	if ($('#nome-prova').val().length <= 0){abreAviso("O nome da avaliação não foi informado.");}
	else{
    var allAboveZero = true;
var arrayEnum = [];

// Validate input values
for (var i = 1; i <= 10; i++) {
    var enunciado = $("#" + i + "-enunciado").val();
    if (!enunciado || enunciado <= 0) {
        allAboveZero = false;
        arrayEnum.push(i);
    }
}

    if (allAboveZero) {
        if (arrayResp && arrayResp.length == 10) {
            var xmlString = '<?xml version="1.0" encoding="UTF-8"?><avaliacao><nome-prova>' + $('#nome-prova').val() + '</nome-prova>';
            for (var i = 1; i <= 10; i++) {
                var enunciado = $("#" + i + "-enunciado").val();
                var altA = $("#" + i + "-alt-a").val();
                var altB = $("#" + i + "-alt-b").val();
                var altC = $("#" + i + "-alt-c").val();
                var altD = $("#" + i + "-alt-d").val();
                var altE = $("#" + i + "-alt-e").val();
                xmlString += "<questao numero='" + i + "'>";
                xmlString += "<enunciado>" + enunciado + "</enunciado>";
                xmlString += "<alternativas>";
                xmlString += altA ? (arrayResp.includes(i) ? "<A resp='certa'>" + altA + "</A>" : "<A>" + altA + "</A>") : "";
                xmlString += altB ? (arrayResp.includes(i) ? "<B resp='certa'>" + altB + "</B>" : "<B>" + altB + "</B>") : "";
                xmlString += altC ? (arrayResp.includes(i) ? "<C resp='certa'>" + altC + "</C>" : "<C>" + altC + "</C>") : "";
                xmlString += altD ? (arrayResp.includes(i) ? "<D resp='certa'>" + altD + "</D>" : "<D>" + altD + "</D>") : "";
                xmlString += altE ? (arrayResp.includes(i) ? "<E resp='certa'>" + altE + "</E>" : "<E>" + altE + "</E>") : "";
                xmlString += "</alternativas>";
                xmlString += "</questao>";
            }
            xmlString += "</avaliacao>";

           
            var blob = new Blob([xmlString], { type: 'text/xml' });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'question.xml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            var arraySresp = [];
            for (let i = 1; i <= 10; i++) {
                if (!arrayResp.includes(i)) {
                    arraySresp.push(i);
                }
            }
            abreAviso("O gabarito das questões " + arraySresp.join(', ') + " não foi informado.");
        }
    } else {
        abreAviso("O enunciado das questões " + arrayEnum.join(', ') + " não foi informado.");
    }
}}
		
      
   
   async function cargaDadosAI() {
      if (arrayResp.length < 10) {
         abreAviso("Algumas questões não foram respondidas, estas não serão processadas.<div class='botao-acao hover-azul' id='continueBtn'>Continuar</div>");
      } else {
         $('.loader-pre').fadeIn(500);
         var calcBarra = 0;
         for (let i = 1; i <= 10; i++) {
            const enunciado = $("#" + i + "-enunciado").val();
            const questaoElem = $("#questao-" + i);
            const alternativas = ["a", "b", "c", "d", "e"];
            let respUser = '';
            let respCerta = '';
            let acertou = false;
            for (const alt of alternativas) {
               const altElem = $("#" + i + "-alt-" + alt);
               if (altElem.hasClass('gabarito')) {
                  var respondeu = 1;
                  if (altElem.attr('resp') === 'certa') {
                     acertou = true;
                     respCerta = altElem.attr('value');
					 respUser = altElem.attr('value');
					 console.log(respCerta+'   respcerta');
                     altElem.addClass('gabarito');
                     altElem.siblings('.radio-alt').html('✔').addClass('gabarito');
                     altElem.siblings('.alt-numero').addClass('gabarito');
					 questaoElem.children('.n-questao').append(' - Aluno acertou');
                  } else {
                     respUser = altElem.attr('value');
					 console.log(respUser+'   respuser');
                     altElem.removeClass('gabarito').addClass('errado');
                     altElem.siblings('.radio-alt').html('X').addClass('errado');
                     altElem.siblings('.alt-numero, .radio-alt').addClass('errado');
                     questaoElem.children('.n-questao').append(' - Aluno errou');
                     altElem.css('cursor', 'auto');
                     altElem.siblings('.alt-numero').css('cursor', 'auto');
                  }
               }
            }
            const feedbackMessage = acertou ? `O aluno acertou a seguinte questão: ${enunciado}. O aluno respondeu: "${respUser}". Disserte sobre isso, considerando apenas a resposta informada como correta.` : `O aluno errou a seguinte questão: ${enunciado}. O aluno respondeu: "${respUser}" quando a opção correta era "${respCerta}". Disserte sobre isso, considerando que exista apenas uma resposta correta.`;
            $('.texto-loader-gpt').html("Analisando Respostas " + i + "/10");
            calcBarra = calcBarra + 10;
            console.log(calcBarra);
            $('.barra-AI').css('width', calcBarra + "%");
            if (respUser.length > 1) {
               await chat.send(feedbackMessage, i);
               respondeu = 0
			   
            } else {}
            if (i === 10) {
               console.log("Finished analyzing responses.");
               $('.loader-pre').fadeOut(500);
               $('.resultScreen').fadeIn(500);
               arrayResp.length = 0;
			   
            }
         }
      }
   }

   function geradorQuestoes() {
      for (var i = 1; i <= 10; i++) {
         var displayStyle = (i == 1) ? '' : 'display:none;';
         var questaoContent = '<div id="questao-' + i + '" class="questao" style="' + displayStyle + '">' + '<div class="n-questao">Questão ' + i + '</div>' + '<textarea type="textarea" class="enunciado-style" id="' + i + '-enunciado"></textarea>';
         var alternativas = ['A', 'B', 'C', 'D', 'E'];
         for (var j = 0; j < alternativas.length; j++) {
            questaoContent += '<div class="cont-alt">' + '<div class="alt-numero">' + alternativas[j] + '</div>' + '<input type="text" class="alt-style" id="' + i + '-alt-' + alternativas[j].toLowerCase() + '">' + '<div class="radio-alt">✔</div>' + '</div>';
         }
         questaoContent += '</div>';
         $('.wrap-questoes').append(questaoContent);
         $('#generateXMLBtn').show();
         $('#sendToAiBtn').hide();
         $('.prova-individual input, .prova-individual textarea').prop('disabled', false);
      }
   }
   const dropzone = document.getElementById('dropzone');
   ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
   });
   ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, highlight, false);
   });
   ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, unhighlight, false);
   });
   dropzone.addEventListener('drop', handleDrop, false);

   function preventDefaults(event) {
      event.preventDefault();
      event.stopPropagation();
   }

   function highlight() {
      dropzone.classList.add('hover');
   }

   function unhighlight() {
      dropzone.classList.remove('hover');
   }

   function handleDrop(event) {
      const dt = event.dataTransfer;
      const files = dt.files;
      handleFiles(files);
   }

   function handleFiles(files) {
      for (const file of files) {
         const reader = new FileReader();
         reader.onload = function(event) {
            const XMLcontent = event.target.result;
            logXmlcontent(XMLcontent);
         };
         reader.readAsBinaryString(file);
      }
   }

   function fixEncoding(XMLcontent) {
      var fixedContent = decodeURIComponent(escape(XMLcontent));
      return fixedContent;
   }

   function logXmlcontent(XMLcontent) {
      var fixedXMLcontent = fixEncoding(XMLcontent);
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(fixedXMLcontent, "text/xml");
      var avaliacaoText = xmlDoc.getElementsByTagName("nome-prova")[0].textContent;
      var questoes = xmlDoc.getElementsByTagName("questao");
      var questoesVars = [];
      for (var q = 0; q < questoes.length; q++) {
         var numeroQuestao = questoes[q].getAttribute("numero");
         var enunciadoNode = questoes[q].getElementsByTagName("enunciado")[0];
         var enunciado = enunciadoNode.textContent;
         var alternativas = questoes[q].getElementsByTagName("alternativas")[0].children;
         var alternativasVars = [];
         for (var i = 0; i < alternativas.length; i++) {
            var alternativa = alternativas[i].tagName;
            var resposta = alternativas[i].getAttribute("resp");
            var alternativaText = alternativas[i].textContent;
            alternativasVars.push({
               letra: alternativa,
               respostaC: resposta,
               texto: alternativaText
            });
         }
         questoesVars.push({
            titulo: avaliacaoText,
            numero: numeroQuestao,
            enunciado: enunciado,
            alternativas: alternativasVars
         });
      }
      geradorQuestoes2(questoesVars);
      ambiente = 1;
      fechaImportador();
      janela = 1;
      $('#aval-title').html('Realizar Avaliação');
      $('.prova-individual').fadeIn(500);
      $('.prova-individual').css({
         'animation': 'blowInContent 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
      });
   }

   function geradorQuestoes2(questoesVars) {
      $('.wrap-questoes').empty();
      var questao = questoesVars[0];
      $('#nome-prova').val(questao.titulo);
      for (var i = 0; i < questoesVars.length; i++) {
         var questao = questoesVars[i];
         var displayStyle = (i == 0) ? '' : 'display:none;';
         var questaoContent = '<div id="questao-' + questao.numero + '" class="questao" style="' + displayStyle + '">' + '<div class="n-questao">Questão ' + questao.numero + '</div>' + '<textarea type="text" class="enunciado-style" id="' + questao.numero + '-enunciado">' + questao.enunciado + '</textarea>';
         for (var j = 0; j < questao.alternativas.length; j++) {
            var alternativa = questao.alternativas[j];
            questaoContent += '<div class="cont-alt">' + '<div class="alt-numero" >' + alternativa.letra + '</div>' + '<input type="text" class="alt-style" resp="' + alternativa.respostaC + '" id="' + questao.numero + '-alt-' + alternativa.letra.toLowerCase() + '" value="' + alternativa.texto + '">' + '<div class="radio-alt">✔</div>' + '</div>';
         }
         questaoContent += '</div>';
         $('.wrap-questoes').append(questaoContent);
         $('#generateXMLBtn').hide();
         $('#sendToAiBtn').show();
         $('.prova-individual input, .prova-individual textarea').prop('disabled', true);
      }
   }
   var animationInProgress = false;

   function changeQuestion(direction) {
      if (animationInProgress) {
         return;
      }
      animationInProgress = true;
      $('.wrap-questoes').children('#questao-' + Qatual).fadeOut(250);
      if (direction === "next") {
         Qatual = (Qatual % 10) + 1;
      } else if (direction === "previous") {
         Qatual = (Qatual - 2 + 10) % 10 + 1;
      }
      $('.n-maneiro').html(Qatual < 10 ? '0' + Qatual : Qatual);
      setTimeout(function() {
         $('#' + Qatual + 'enunciado').focus();
         $('.wrap-questoes').children('#questao-' + Qatual).fadeIn(250, function() {
            animationInProgress = false;
         });
      }, 350);
   }
   $("#generateXMLBtn").click(function() {
      formatadorXML();
   });
   $("#proxQ").click(function() {
      changeQuestion("next");
   });
   $(document).on("keydown", function(event) {
      if (event.which === 39) {
         changeQuestion("next");
      }
   });
   $("#Qant").click(function() {
      changeQuestion("previous");
   });
   $("#fechaAviso").click(function() {
      fechaAviso();
   });
   $(document).on("keydown", function(event) {
      if (event.which === 37) {
         changeQuestion("previous");
      }
   });
   $(document).on("keydown", function(event) {
      if (event.which === 27 && janela == 0) {
         fechaProva();
      }
   });
   $(document).on("keydown", function(event) {
      if (event.which === 27 && janela == 3) {
         fechaImportador();
      }
   });
   $(document).on("keydown", function(event) {
      if (event.which === 27 && janela == 2) {
         fechaAviso();
      }
   });
   $('#sendToAiBtn').click(function() {
      cargaDadosAI();
   });
   $('#contentAviso').on('click', '#continueBtn', function() {
      arrayResp.length = 10;
      cargaDadosAI();
   });
});