---
title: '[MAC0470#05] - Contribuindo com o kworkflow'
description: 'Minha segunda contribuição, agora com uma ferramenta para o kernel'
pubDate: 'Apr 20 2024'
heroImage: '/kernel-dev.jpg'
tags: ['mac0470']
---

Aqui se inicia uma nova etapa na disciplina. Encerramos o ciclo de contribuição com o kernel e agora iniciamos o ciclo de contribuição com o kworkflow.

## O Que é kworkflow

De forma simples, uma coleção de _scripts_ para auxiliar no processo de desenvolvimento do kernel Linux (esse era o propósito inicial, atualmente o projeto se extende além disso). 

## Preparando o Ambiente

Para contribuir com _kw_ (kworkflow) usamos uma abordagem diferente e mais moderna, quando comparada à forma que o kernel aborda. Aqui criamos um _fork_ do repositório `kworkflow/kworkflow` no GitHub e desenvolvemos na branch `unstable`.

Nesse ponto eu cometi um erro acidentalmente realizando um _fork_ usando apenas a branch `master`. A solução passou for fazer um `fetch --all` para coletar as branches do `upstream` depois dar checkout na `unstable` e definir seu _upstream_ como `origin/unstable`. Na realidade o processo foi um pouco demorado até que eu e minha dupla descobrissemos exatamente o que tinhamos feito de errado no _fork_, mas no fim tudo ocorreu bem.

## Contribuindo

Enquanto eu vasculhava o repositório do _kw_, encontrei um trecho de código curioso onde a variável de ambiente `KW_SOUND_DIR` sendo definida duas vezes como `/usr/share/sounds/kw` o que e uma redundância de código desnecessária.

A contribuição da minha dupla foi corrigir isso. A parte curiosa é que, apesar de nossa contribuição de fato não modificar em nada o funcionamento do _kw_, o _CI_ do GitHub reprovou o nosso _pull request_. Felizmente, para nós, se tratava de um erro do _CI_, bastou pedir para os mantenedores executarem o _CI_ novamente e nosso _PR_ foi aprovado.
