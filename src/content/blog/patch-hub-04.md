---
title: '[Patch-Hub #04] - UX'
description: 'Adicionando melhorias de experiência para os usuários'
pubDate: 'Nov 27 2024'
heroImage: '/patch-hub.png'
tags: ['patch-hub', 'mac0214', 'mac0456']
---

O *patch-hub* é uma ferramenta que já possui várias das features das que foram planejadas. Todavia ainda carecia de 
planejamento nas melhorias de usabilidade para os usuários.

## Telas De Carregamento

O *patch-hub* é uma ferramenta que funciona em apenas um núcleo do processador. A maior consequência disso, era a 
ausência de feedback para o usuário durante operações demoradas, como o download dos *patchsets* das listas de e-mail. 
Para melhorar esse problema, resolvemos criar telas de loading para o app que fossem dinâmicas. O problema é que para 
isso precisariamos de paralelizar o código do projeto e isso não é uma tarefa tão simples em Rust.

Rust é uma linguagem com foco em segurança e é conhecido que paralelismo é uma grande fonte de problemas. Por isso o 
compilador do Rust enforça certos padrões de código para que regiões do código sejam paralelizadas. A primeira parte 
da implementação das telas de carregamento envolveu adequar a estrutura do patch-hub para suportar paralelismo.

Um dos principais detalhes envolve o uso de referências (abordagem segura de ponteiros). Uma referência do Rust não 
pode referenciar um valor que foi liberado da memória. Por isso toda referência carrega consigo a informação do tempo 
de vida do valor que é referenciado por ela. Desse modo, usar referências com *threads* em Rust é algo complicado. 
Teoricamente, uma *thread* pode não terminar nunca, portanto, uma thread não pode referenciar um valor externo ao seu 
escopo, já que esse valor pode ser liberado da memória antes que a *thread* termine.

A solução é usar *mutexes* ou mover valores para dentro da *thread*. No caso do *patch-hub*, usariamos paralelismo em 
um contexto muito específico. Na *thread* principal queremos realizar alguma operação potencialmente demorada, na 
*thread* auxiliar queremos renderizar uma tela de carregamento no terminal com animações. Assim, essa thread auxiliar 
precisa de tomar conta do nosso objeto que representa o terminal e depois devolver ela para a thread principal assim 
que dermos *join* nessa thread.

Uma vez que esses detalhes foram resolvidos, implementei a base para a tela de carregamento usando uma macro:

```rs
terminal = loading_screen! {
    terminal,
    "Loading patchset" => {
        app.init_details_actions()?; // Ação demorada
        app.set_current_screen(CurrentScreen::PatchsetDetails);
    }
};
```

A macro `loading_screen!` recebe 3 parâmetros:

- O objeto do terminal onde estamos renderizando
- O texto a ser exibido na tela de loading
- O código potencialmente demorado que queremos executar
- Devolve o terminal assim que terminar de usar

Ao chamar essa macro, ela vai envolver esse código demorado com estruturas que vão:

- Criar uma thread para desenhar a tela de loading e entregar o terminal para ela
- Executar o código demorado
- Informar para a thread quando o código terminou de executar
- Recuperar o objeto do terminal e reintegrar ele à thread principal

Com isso, agora o *patch-hub* pode dar um bom feedback visual para os usuário enquanto estivermos carregando alguma coisa.

<img src="/assets/projects/patch-hub/patch-hub-loading-screen.png" alt="Tela inicial patch-hub"></img>

## Pop-ups de Ajuda

No espírito de melhorias de usabilidade, introduzi um sistema de pop-ups de ajuda. Cada tela da aplicação instanciaria 
o seu próprio pop-up quando a tecla `?` fosse pressionada. Para aproveitar o esforço, criei o sistema da forma mais 
genérica possível para permitir que mais tipos de pop-ups sejam criados futuramente e reaproveitassem a estrutura que 
eu criei.

Basicamente um pop-up tem 3 responsabilidades:

- Informar as suas dimensões
- Criar um método para se renderizar
- Descrever como vai lidar com a entrada do teclado

Isso foi implementado como um `trait` chamado `PopUp` que funciona como uma interface descrevendo quais funções um tipo 
precisa de implementar para ser um pop-up. O *patch-hub* guarda uma pilha de objetos que implementem `PopUp` e os exibe 
sobre o conteúdo da tela enquanto houverem pop-ups na pilha.

Os pop-up de ajuda são empilhados por cada tela sempre que `?` é pressionado. O pop-up contém basicamente uma descrição do
que a tela faz e quais atalhos estão disponíveis.

<img src="/assets/projects/patch-hub/help-pop-up.png" alt="Pop-up de ajuda"></img>
