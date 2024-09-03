---
title: '[MAC0470#10] - Tentando Empacotar o Nushell para Debian'
description: 'E falhando miseravelmente'
pubDate: 'Jun 06 2024'
heroImage: '/nuscripts.jpg'
tags: ['mac0470']
---

Escrevo esse post logo após o fim da nossa brava tentativa.

Foi nos solicitado que tentássemos criar um pacote para Debian. Eu e meu grupo (Lais Nuto e Thiago Duvanel) tentamos criar um pacote para o Nushell (aproveitando o contexto em que já estavamos imersos).

## Ferramenta de Empacotamento

Primeiro desafio foi encontrar uma ferramenta para poder tentar empacotar o nushell que é um projeto em Rust. Inicialmente tentamos com `dh-cargo` mas não encontramos muitas fontes de ajuda. Mudamos depois para o `debcargo` que foi o que funcionou para nós.

## Criando o Setup

Fizemos tudo em um container com Debian Testing e instalamos as dependências listadas no [tutorial](https://salsa.debian.org/rust-team/debcargo-conf/blob/master/README.rst). Depois de instalar, clonamos o repositório do `debcargo-conf` e executamos `./update.sh nu` para obter o código fonte da _crate_ do Nushell.

## Criando o `.dsc`

Após nos confundir um pouco com as instruções. Executamos o `./release.sh nu` para produzir os arquivos para a gerar uma release. Ajustamos todos os `FIXME` nos arquivos `debian/control`, `debian/copyright` e `debian/changelog`. E executamos o `./build.sh nu`. Finalmente isso nos gerou um `rust-nu_0.94.2-1.dsc`.

Infelizmente, aqui se encerra nossa jornada. Para poder gerar um `.deb` do `.dsc`, encontramos uma problema com uma centena de dependências:

- rustc:native (>= 1.77.2)
- librust-crossterm-0.27+default-dev
- librust-ctrlc-3+default-dev (>= 3.4-~~)
- librust-log-0.4+default-dev
- librust-miette-7+default-dev (>= 7.2-~~)
- librust-miette-7+fancy-dev (>= 7.2-~~)
- librust-miette-7+fancy-no-backtrace-dev (>= 7.2-~~)
- librust-mimalloc-0.1-dev (>= 0.1.42-~~)
- librust-nix-0.28+fs-dev
- librust-nix-0.28+process-dev
- librust-nix-0.28+signal-dev
- librust-nix-0.28+term-dev
- librust-nu-cli-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-cli-0.94+plugin-dev (>= 0.94.2-~~)
- librust-nu-cli-0.94+system-clipboard-dev (>= 0.94.2-~~)
- librust-nu-cmd-base-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-cmd-extra-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+mimalloc-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+sqlite-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+system-clipboard-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+trash-support-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+which-support-dev (>= 0.94.2-~~)
- librust-nu-cmd-plugin-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-command-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-command-0.94+plugin-dev (>= 0.94.2-~~)
- librust-nu-command-0.94+sqlite-dev (>= 0.94.2-~~)
- librust-nu-command-0.94+trash-support-dev (>= 0.94.2-~~)
- librust-nu-command-0.94+which-support-dev (>= 0.94.2-~~)
- librust-nu-engine-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-engine-0.94+plugin-dev (>= 0.94.2-~~)
- librust-nu-explore-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-lsp-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-parser-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-parser-0.94+plugin-dev (>= 0.94.2-~~)
- librust-nu-path-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-plugin-engine-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-protocol-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-protocol-0.94+plugin-dev (>= 0.94.2-~~)
- librust-nu-std-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-system-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-utils-0.94+default-dev (>= 0.94.2-~~)
- librust-reedline-0.32+bashisms-dev
- librust-reedline-0.32+default-dev
- librust-reedline-0.32+sqlite-dev
- librust-reedline-0.32+system-clipboard-dev
- librust-serde-json-1+default-dev
- librust-simplelog-0.12+default-dev
- librust-time-0.3+default-dev
- librust-winresource-0.1+default-dev

Para que pudessemos prosseguir, seria necessário que todas essas dependências também fossem empacotadas. O que seria uma tarefa grande demais que demandaria dezenas de horas de trabalho.
