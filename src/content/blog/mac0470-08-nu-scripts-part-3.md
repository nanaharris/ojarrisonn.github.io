---
title: '[MAC0470#08] - Nu scripts pt. 3'
description: 'ASDF'
pubDate: 'Jun 05 2024'
heroImage: '/nuscripts.jpg'
tags: ['mac0470']
---

Na terceira parte da nossa jornada, pensei em criar _completions_ para uma outra ferramenta de terminal que eu uso bastante: [asdf](https://asdf-vm.com). `asdf` é um gerenciador de versões de ferramentas, em especial, usado para ferramentas relacionadas a linguagens de programação.

Comecei seguindo meu fluxo padrão de criação de _completions_ escrevendo um arquivo `.nu` e fazendo `source` ocasionalmente para testar. Porém, não havia reparado em um detalhe: o asdf já é um script `nu`. Portanto, criar nu completions de forma externa iria sobrescrever as definições originais do script.

Isso não necessariamente faz com que o `asdf` não funcione, porém, o asdf já possui uma integração com nushell, pois alguns comandos retornam seus resultados como _tables_ do nushell e não simples strings.

Ou seja, minhas modificações deveriam ser feitas diretamente no script `asdf.nu`. Logo, era hora de criar um _fork_ do projeto `asdf`.

## Minhas Contribuições

Como dito anteriormente, `asdf` é usado para gerenciar versões de ferramentas. Ao executar o comando `asdf plugin add <tool>` instalamos um plugin para gerenciar `<tool>`. Então, criei _completions_ para listar todos os plugins que estão catalogados pelo `asdf` (no momento são cerca de 700 plugins, infelizmente a completion é relativamente lenta).

O comando `asdf install <tool> <version>` instala a versão `<version>` para a ferramenta `<tool>`, portanto adicionei _completions_ para ambos argumentos (na verdade a completion para `<tool>` já existia, apenas utilizei ela para listar os plugins instalados).

Por fim, o comando `asdf global|local <tool> <version>` que define a versão da ferramenta `<tool>` no escopo global ou local. Assim, adicionei uma completion para listar as versões instaladas da ferramenta.

## O Pull Request

Infelizmente não havia me atentado ao detalhe que nenhum commit era feito no repositório do projeto há 5 meses. Fiz o PR e alguma pessoa (não relacionada ao projeto) comentou um "Ok". Desde então não tive mais nenhum feedback.
