---
title: 'Tutorial Linters'
description: 'O extremo básico sobre um linter'
pubDate: 'Oct 29 2024'
heroImage: '/nuscripts.jpg'
tags: ['linting', 'mac0332']
---

## O que é um linter

Linters são ferramentas de análise estática de código que servem para detectar problemas semânticos do código que o compilador não pode detectar e que podem prejudicar a execução do programa ou a manutenibilidade do código. Linters possuem configurações que podem ser personalizadas para determinar como inspecionar o código através de regras e níveis assim determinando padrões de escrita de código.

Uma regra diz qual tipo de padrão o linter deve inspecionar no código. Existem regras para os mais diversos padrões, por exemplo: usar nomes `camelCase`, uso de notações de tipo (em linguagens dinâmicas), checar tamanho das funções, checagem de valores nulos, proibir uso de certos métodos, etc.

Para cada regra se define o nível de severidade de uma infração dessa regra, em geral os níveis são: desligado, alerta e erro. Podemos configurar uma regra para usar nomes de função `snake_case` com nível de erro. Desse modo, ao escrever um código como o baixo:

```js
function DoSomething() {
    // ...
}
```

Um linter como ESLint emitiria um erro informando que o nome da função não atende ao padrão

## Configurando Linters

### Javascript ESLint

> Referência https://eslint.org/

Adicione o ESLint ao seu projeto Node com

```sh
npm install --save-dev eslint @eslint/js
```

Crie o arquivo de configurações `eslint.config.js` e inicie com o setup padrão:

```js
import js from "@eslint/js";

export default [
    js.configs.recommended,
{
    rules: {
        "no-unused-vars": "warn",
    }
}
];
```

No campo `rules` é onde são feitas as configurações de quais regras o ESLint deve adotar quando executar a verificação do seu projeto. Veja todas opções de [configuração](https://eslint.org/docs/latest/use/configure/) e a [lista de regras](https://eslint.org/docs/latest/rules/).

Para executar o linter rode (na raiz do projeto):

```sh
npx eslint . # vai analisar todos arquivos do diretório atual
npx eslint . --fix # analisa e corrige os arquivos 
```

Editores de texto tem suporte a extensões para integrar o ESLint ao seu fluxo de trabalho. A extensão ESLint do VS Code executa a análise em tempo real, mostra problemas no código e fornece ações de código para aplicar correções.

### Python Pylint ##

>Referência https://www.pylint.org/

Instale o pylint disponível no PyPI

```sh
pip install pylint
```

Crie o arquivo de configurações padrão

```sh
pylint --generate-rcfile
```

O arquivo é dividido em seções, uma para cada verificador (_checker_), você pode ver os diferentes [recursos](https://pylint.pycqa.org/en/latest/user_guide/configuration/all-options.html) (no formato de opções para a linha de comando) e mais [detalhes](https://pylint.pycqa.org/en/latest/user_guide/checkers/features.html)

Você pode passar as opções de linha de comando para o comando `pylint --generate-rcfile` e assim gerar um arquivo com as opções desejadas.

Para executar o linter rode (na pasta do projeto):

```sh
pylint . # vai analisar todos arquivos no diretório atual
```

Editores de texto tem suporte a extensões para integrar o Pylint ao seu fluxo de trabalho. A extensão Pylint do VS Code executa a análise em tempo real, mostra problemas no código e fornece ações de código para aplicar correções.

### Rust Clippy

> Referência https://doc.rust-lang.org/clippy/

Clippy já vem instalado como um componente na instalação padrão do Rustup. Caso não o tenha, adicione com:

```sh
rustup component add clippy
```

Modifique o arquivo `Cargo.toml` do seu projeto para incluir duas novas seções:

```toml
[lints.rust]

[lints.clippy]
```

O rust possui um linter nativo (bastante simples), suas regras podem ser configuradas na primeira seção. Já as regras de linting adicionadas pelo `Clippy` devem ficar na seção `[lints.clippy]` Verifique a documentação completa sobre [configuração](https://doc.rust-lang.org/clippy/configuration.html) e [regras](https://doc.rust-lang.org/clippy/lint_configuration.html).

Para executar o linter rode (na pasta do projeto):

```sh
cargo clippy
```

### Kotlin Ktlint

>Referência https://pinterest.github.io/ktlint/latest/

Diferentemente de outros linters, o Ktlint é recomendado para ser instalado como um plugin do seu editor de texto. Para instalar o plugin no IntelliJ IDEA, vá em _File > Settings > Plugins > Marketplace_ e procure por _Ktlint_ e instale. Basicamente nenhuma configuração é necessária, o plugin já vem com as regras padrão que são recomendadas como forma de verdadeiramente padronizar o estilo de código.

A verficação e formatação do código é feita automaticamente pelo plugin.
