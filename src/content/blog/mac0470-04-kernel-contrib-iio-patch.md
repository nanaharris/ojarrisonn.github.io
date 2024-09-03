---
title: '[MAC0470#04] - Enviando um patch'
description: 'Hora da verdade, enviando nossa contribuição'
pubDate: 'Apr 20 2024'
heroImage: '/kernel-dev.jpg'
tags: ['mac0470']
---

No [post anterior](/blog/mac0470-03-kernel-contrib-iio), realizamos nossas modificações para submissão do patch. Na verdade, submetemos primeiro o patch para os monitores da disciplina para que eles fizessem uma revisão do nosso código. Eles encontraram alguns erros (principalmente, ausência de `{ }` indicando o escopo onde o modo direto seria usado).

Apenas aplicamos as correções pedidas pelos monitores e reenviamos o patch para que eles pudessem avaliar novamente.

Quanto ao processo de submissão. O time de desenvolvimento do kernel envia os patches via _e-mail_. Precisei de realizar uma configuração no `git` para autenticar com meu _e-mail_ institucional usando o `kw mail` e depois usar o subcomando `format-patch` do `git` para criar os arquivos `.patch`. Apenas modifiquei a _cover letter_ para ficar de acordo com o esperado e tive de modificar os demais arquivos `.patch` para apontarem para o e-maiil correto (na minha máquina, meu _e-mail_ pessoal estava configurado como padrão, enquanto eu queria enviar os patches com meu _e-mail_ institucional da USP).

Com tudo configurado, enviar os patches via _e-mail_ foi tão simples quanto `git send-email *.patch`.
