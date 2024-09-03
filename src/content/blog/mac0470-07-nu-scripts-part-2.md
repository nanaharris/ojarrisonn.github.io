---
title: '[MAC0470#07] - Nu scripts pt. 2'
description: 'Mais algumas completions'
pubDate: 'May 31 2024'
heroImage: '/nuscripts.jpg'
tags: ['mac0470']
---

Ainda na saga da criação de completions para Nushell criei um novo script para `gradlew` e dei uma leve melhorada no script para `git`

## Gradle Wrapper

Gradle é um _build system_ muito usado para projetos em linguagens que executam na JVM gerados a partir de templates. O Gradle Wrapper é um script que costuma vir junto com os projetos para garantir que a versão correta do Gradle seja usada no projeto ainda que Gradle sequer esteja instalado na máquina. O script normalmente fica no arquivo `gradlew` na raíz do projeto e é geralmente invocado com `./gradlew`.

Para gerar completions, além das flags padrão ddo script, existem as _tasks_. _Tasks_ são similares aos _targets_ de um `Makefile` e indicam tarefas a serem executadas, por exemplo: compilar o projeto em um `.jar`, executar o projeto, debuggar, limpar artefatos produzidos pelo _build_, etc.

A lista de _tasks_ disponível depende do projeto e pra isso existe a _task_ `tasks` que lista todas as _tasks_ disponíveis (embora possa ser lenta). Um pequeno exemplo de saída produzido pelo `./gradlew tasks`

```txt
Application tasks
-----------------
run - Runs this project as a JVM application
runShadow - Runs this project as a JVM application using the shadow jar
startShadowScripts - Creates OS specific scripts to run the project as a JVM application using the shadow jar
```

O script de completion para `./gradlew` inclui uma função que produz uma lista de _completions_ para cada _task_ com a descrição fornecida por `./gradlew tasks` usando _regexes_ com capturas para gerar uma tabela de colunas `value` e `description`.

```nu
def "nu-complete gradlew" [] {
    ./gradlew tasks
    | lines
    | parse --regex '(?P<value>[a-zA-Z]+) - (?P<description>.+)'
}
```

Isso produz tabelas como:

```txt
╭────┬────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────╮
│  # │                    task                    │                            description                             │
├────┼────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│  0 │ run                                        │ Runs this project as a JVM application                             │
│  1 │ runShadow                                  │ Runs this project as a JVM application using the shadow jar        │
│  2 │ startShadowScripts                         │ Creates OS specific scripts to run the project as a JVM            │
│    │                                            │ application using the shadow jar                                   │
╰────┴────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────╯
```

Note que o comando `parse` vai ignorar linhas que não sigam o padrão da regex especificada.

## Git Clone

O script para _completions_ do `git` não possuía completions para o subcomando `clone`. Criar completions para comandos do git é tão simples quanto observar `git clone --help` e então listar as flags.

A parte boa disso é que eu passo a conhecer uma centena de novos conceitos sobre git que eu não sabia, como por exemplo: git permite que o clone seja feito de um repositório local e pode usar ou não _hardlinks_ usando ou não o protocolo do git.
