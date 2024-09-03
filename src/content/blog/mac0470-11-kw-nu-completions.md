---
title: '[MAC0470#11] - Nu Scripts e KW'
description: 'O crossover'
pubDate: 'Jun 23 2024'
heroImage: '/nuscripts.jpg'
tags: ['mac0470']
---

A contribuição final que eu e minha dupla fizemos nesse semestre foi de certa forma uma união do que foi trabalhado ao longo do semestre. Juntando o conhecimento que adquirimos sobre o `kw` e sobre a criação de _nu scripts_ para _completions_, criamos _completions_ em `nu` para o `kw` e integramos isso ao script de instalação do `kw`.

## As _Completions_

Criar as _completions_ não foi algo muito complicado pois o `kw` possui uma boa documentação na maior parte (existem algumas flags não documentadas em alguns comandos, mas são raras). A parte mais interessante foi trabalhada no comando `kw init`.

Uma das flags desse comando (`--arch`) especifica a arquitetura para a qual o _kernel_ será compilado. Lendo a _manpage_ descobri que as arquiteturas disponíveis ficam listadas no diretório `arch` dentro da _kernel tree_. Bastou uma simples função para criar uma _completion_  inteligente para isso.

Demorou apenas umas poucas horas para que tivessemos escrito todas as completions para o `kw`.

## `setup.sh`

O `kw` é instalado através de um script `setup.sh`. Minha ideia original era colocar uma cópia do script que criamos dentro do repositório do `kw` e copiar ele para algum lugar durante a instalação. Todavia, uma abordagem mais interessante seria baixar o script durante a instalação. Isso evitaria ter que "manter" o mesmo script atualizado em dois repositórios diferentes.

Assim minha contribuição se baseou em encontrar o ponto da instalação onde o `kw` instala as _completions_  para `bash` e `zsh` e então adicionar um fluxo que:

1. Detecta se o usuário possui nushell instalado
2. Pergunta se ele desejar instalar
3. Baixar o script e instruir o usuário a como ativar

Caso o usuário não deseje instalar ou o download falhe, informo o link do repositório para que possa fazer o download manualmente depois.
