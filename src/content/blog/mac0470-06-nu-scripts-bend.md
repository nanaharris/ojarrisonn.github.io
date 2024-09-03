---
title: '[MAC0470#06] - Nu scripts pt. 1'
description: 'Criando completions para Bend'
pubDate: 'May 25 2024'
heroImage: '/nuscripts.jpg'
tags: ['mac0470']
---

Aqui se inicia a segunda parte da disciplina MAC0470 onde vamos contribuir com os projetos que quisermos (existem certas restrições, mas não vem ao caso). O ecossitema onde eu e minha dupla Laís Nuto vamos fazer nossas contribuições será o [Nushell](https://www.nushell.sh/).

## O que é Nushell

Nushell é um shell (assim como Bash, Zsh, Fish, etc.) multiplataforma que possui como característica mais marcante a sua linguagem de script `nu` que é fortemente inspirada nas modernas linguagens de programação funcionais com suporte a tipos. Diferentemente de um script Bash onde toda entrada e saída é um texto, o Nushell possui tipos e coleções (tabelas e listas) para poder trabalhar com pipelines e processar dados de forma mais eficaz.

Por exemplo, o comando `ls` no Nushell me devolve uma tabela ao invés de uma lista de strings com nomes de arquivos.

```nu
 ❯ ls
╭────┬─────────────────────┬──────┬───────────┬───────────────╮
│  # │        name         │ type │   size    │   modified    │
├────┼─────────────────────┼──────┼───────────┼───────────────┤
│  0 │ README.md           │ file │   2.9 KiB │ 2 months ago  │
│  1 │ astro.config.mjs    │ file │     377 B │ 2 months ago  │
│  2 │ bun.lockb           │ file │ 251.6 KiB │ 2 months ago  │
│  3 │ components.json     │ file │     351 B │ 2 months ago  │
│  4 │ node_modules        │ dir  │  20.0 KiB │ 2 months ago  │
│  5 │ package.json        │ file │     855 B │ 2 months ago  │
│  6 │ public              │ dir  │   4.0 KiB │ 6 minutes ago │
│  7 │ src                 │ dir  │   4.0 KiB │ 2 months ago  │
│  8 │ tailwind.config.js  │ file │   2.1 KiB │ 2 months ago  │
│  9 │ tailwind.config.mjs │ file │     176 B │ 2 months ago  │
│ 10 │ tsconfig.json       │ file │     237 B │ 2 months ago  │
╰────┴─────────────────────┴──────┴───────────┴───────────────╯
```

Podemos usar pipes (`|`) para manipular a saída do comando `ls` para listar apenas diretórios usando o comando `where`

```nu
 ❯ ls | where type == "dir"
╭───┬──────────────┬──────┬──────────┬───────────────╮
│ # │     name     │ type │   size   │   modified    │
├───┼──────────────┼──────┼──────────┼───────────────┤
│ 0 │ node_modules │ dir  │ 20.0 KiB │ 2 months ago  │
│ 1 │ public       │ dir  │  4.0 KiB │ 8 minutes ago │
│ 2 │ src          │ dir  │  4.0 KiB │ 2 months ago  │
╰───┴──────────────┴──────┴──────────┴───────────────╯
```

Podemos pegar apenas a coluna `name`

```nu
 ❯ ls | where type == "dir" | get name
╭───┬──────────────╮
│ 0 │ node_modules │
│ 1 │ public       │
│ 2 │ src          │
╰───┴──────────────╯
```

E por que não deixar tudo em maiúsculas? (O comando `each` vai mapear cada elemento usando a _lambda function_ passada `{|d| $d | str upcase}`)

```nu
 ❯ ls | where type == "dir" | get name | each {|d| $d | str upcase }
╭───┬──────────────╮
│ 0 │ NODE_MODULES │
│ 1 │ PUBLIC       │
│ 2 │ SRC          │
╰───┴──────────────╯
```

## Com o que vamos contribuir

_Scripts_ `nu` são extremamente poderosos e o shell possui muitas _features_ a serem exploradas e configuradas. Para isso, criaram o repositório [nushell/nu_scripts](https://github.com/nushell/nu_scripts) para os usuários compartilharem seus _scripts_ utilitários, como por exemplo: _scripts_ de _completion_. _Scripts_ de _completion_ são _scripts_ que ajudam o usuário com auto-complete para subcomandos e flags dos executáveis no terminal. O que eu e a Laís vamos fazer é contribuir escrevendo/melhorando _scripts_ de _completion_ para vários programas, como por exemplo: git e o kw.

Apenas como um exemplo, isso é o que o _script_ `git-completion.nu` provê quando digito `git branch -` e teclo `Tab` para receber sugestões:

```nu
 ❯ | git branch -
--abbrev            use short commit hash prefixes
--all               list both remote and local branches
--color             use color in output
--contains          show only branches that contain the specified commit
--copy              copy branch together with config and reflog
--delete            delete branch
--edit-description  open editor to edit branch description
--format            specify format for listing branches
--list              list branches
--merged            list reachable branches
--move              rename branch
--no-contains       show only branches that don't contain specified commit
```

Diferentemente das completions do Bash, aqui eu posso usar as setas do teclado para escolher uma opção e o Nushell vai completar a linha ao invés de só imprimir as opções e criar uma nova linha embaixo.

## Bend

Resolvi começar com algo completamente novo, para entender como funciona o ciclo de contribuição dos _Nu Scripts_. Cerca de uma semana antes do momento em que escrevo esse blog post, uma companhia brasileira [Higher Order Company](https://higherorderco.com/) lançou uma versão beta da linguagem de programação [Bend](https://github.com/HigherOrderCO/Bend) e com ela um utilitário homônimo para permitir que os usuários executem os programas escritos em `bend`. De forma simples, a linguagem Bend permite que os desenvolvedores escrevam programas nativamente paralelizáveis para serem executados nos núcleos da CPU ou até mesmo na GPU.

Estudando a própria página de ajuda fornecida com `--help` para `bend` e cada um dos subcomandos fui capaz de construir o _script_ de _completion_ inteiro. Segue um exemplo de como são as completions para o subcomando `bend run-cu` que executa o programa nos CUDA cores da sua placa de vídeo Nvidia:

```nu
# Compiles the program and runs it with the Cuda HVM implementation
export extern "bend run-cu" [
    -p                                              # Debug and normalization pretty printing
    -O: string@"nu-complete bend opts"              # Enables or disables the given optimizations
    --io                                            # Run with IO enabled
    -l                                              # Linear readback (show explicit dups)
    --stats(-s)                                     # Show runtime stats and rewrite counts
    --warn(-W): string@"nu-complete bend warn"      # Show the specified compilation warning
    --deny(-D): string@"nu-complete bend warn"      # Deny the specified compilation warning
    --allow(-A): string@"nu-complete bend warn"     # Allow the specified compilation warning
    --help(-h)                                      # Print help
    --entrypoint(-e): string                        # Use other entrypoint rather than main or Main
    --verbose(-v)                                   # Be verbose
]
```

Observe que faço menção a dois comandos: `nu-complete bend warn` e `nu-complete bend opts`. Isso é mais uma das features muito legais das completions no Nushell que me permite escrever uma função que indica um conjunto de valores possíveis para uma opção. Assim estão definidos os dois comandos supracitados:

```nu
def "nu-complete bend opts" [] {
    [all, no-all, eta, no-eta, prune, no-prune, 
    linearize-matches, linearize-matches-alt, 
    no-linearize-matches, float-combinators, 
    no-float-combinators, merge, no-merge, inline, 
    no-inline, check-net-size, no-check-net-size]
}

def "nu-complete bend warn" [] {
    [all, irrefutable-match, redundant-match, unreachable-match, unused-definition, repeated-bind, recursion-cycle]
}
```

Com isso, ao digitar `bend run-cu -O` e pressionar `Tab` eu posso escolher uma opção de otimização dentre as disponíveis:

```nu
 ❯ | bend run-cu -O
all                    no-all                 eta                    no-eta
prune                  no-prune               linearize-matches      linearize-matches-alt
no-linearize-matches   float-combinators      no-float-combinators   merge
no-merge               inline                 no-inline              check-net-size
no-check-net-size
```

## Enviando minha contribuição

Poucos minutos após abrir o pull request do meu _fork_ para o _upstream_, um mantenedor me deu um feedback. Ele solicitou que eu escrevesse um pequeno `readme.md` para informar sobre o que é `bend` e onde as pessoas podem obter ele.

Escrevi o `readme`, atualizei o PR e em menos de 10 minutos o mantenador aprovou meu _script_ e integrou com a _master_.

Com isso, agora estou preparado para, junto com minha dupla, fazer mais contribuições, uma vez que agora já conheço bem como funciona o ciclo de contribuições do projeto.
