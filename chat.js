const chat = (id) => window.document.getElementById(id);

chat.endPoint = "https://api.openai.com/v1/chat/completions";
chat.model = "gpt-3.5-turbo";
chat.body = { model: chat.model, temperature: 0.8 };
chat.history = [];

chat.stream = function (prompt) {
  chat.body.stream = true;
  chat.body.messages = [{ role: "user", content: prompt }];
  chat.headers = { "Authorization": `Bearer sk-proj-cTkOf6UjePG30pL2WJcpT3BlbkFJXtiNSYN9K5sieOyeDebA`, "Content-Type": "application/json" };
  chat.result = '';
  chat.controller = new AbortController();
  const signal = chat.controller.signal;

  for (let i = chat.history.length - 1; i >= 0 && i > (chat.history.length - 3); i--) {
    chat.body.messages.unshift({ role: 'assistant', content: chat.history[i].result });
    chat.body.messages.unshift({ role: 'user', content: chat.history[i].prompt });
  }

  fetch(chat.endPoint, { method: 'POST', headers: chat.headers, body: JSON.stringify(chat.body), signal })
    .then(response => { 
      if (!response.ok) {
        if (response.status == 401) throw new Error('401 Unauthorized, invalid API Key');
        throw new Error('Failed to get data, error status ' + response.status);
      }
      
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      
      reader.read().then(function processText({ done, value }) {
        const lines = (chat.value = value).split('\n');

        for (let i in lines) {
          if (lines[i].length === 0) continue;
          if (lines[i].startsWith(':')) continue;

          chat.json = JSON.parse(lines[i].substring(6));
          if (chat.json.choices) {
            chat.result += (chat.json.choices[0].delta.content || '');
          }	 
        }

        return reader.read().then(processText);
      });
    })
    .catch(error => chat.onerror(error));
};

chat.send = async function (prompt, questao) {
    chat.body.stream = false;
    chat.body.messages = [{ role: "user", content: prompt }];
    chat.headers = { "Authorization": `Bearer sk-proj-cTkOf6UjePG30pL2WJcpT3BlbkFJXtiNSYN9K5sieOyeDebA`, "Content-Type": "application/json" };
    chat.result = '';
    chat.controller = new AbortController();
    const signal = chat.controller.signal;

    try {
        const response = await fetch(chat.endPoint, { method: 'POST', headers: chat.headers, body: JSON.stringify(chat.body), signal });
        const json = await response.json();

        if (json.choices) {
            const storeGPT = json.choices[0].message.content;
            console.log(storeGPT);

            // Replace newline characters with HTML line breaks
            const formattedContent = storeGPT.replace(/\n/g, '<br>');

            // Append the formatted content to the DOM
            $('.resultScreen').append('<div class="analise-q" id="analise-q-' + questao + '"</div>');
            $('#analise-q-' + questao).append($('#questao-' + questao));
            $('#questao-' + questao).css({
                'display': '',
                'position': 'relative',
                'left': '0',
                'top': '0'
            });
            $('#analise-q-' + questao).append('<div class="respostaGPT"><div class="analise-hero">Análise da resposta</div>' + formattedContent + '</div>');
        }
    } catch (error) {
        console.error(error);
    }
};



chat.onerror = (error) => { alert(error); };
