---
title: '[MAC0470#12] - O Fim?'
description: 'Conclusão da Disciplina'
pubDate: 'Jun 23 2024'
heroImage: '/nuscripts.jpg'
tags: ['mac0470']
---

Aqui chegamos ao fim dessa jornada. Nesse post vou passar rapidamente por cada etapa da disciplina lembrando o que foi feito e tentando avaliar o que eu obtive do ponto de vista de aprendizados.

## Kernel

Após seguir os tutoriais iniciais (e tendo de refazer eles), eu e minha dupla contribuímos com os módulos `ad7607` e `ad7923` do subsistema IIO aplicando a sugestão de usar o `claim_direct_scoped`.

```c
switch (m) {
    case IIO_CHAN_INFO_RAW:
        iio_device_claim_direct_scoped(return -EBUSY, indio_dev) {
            ret = ad7606_scan_direct(indio_dev, chan->address);
                if (ret < 0)
                    return ret;
                *val = (short) ret;
                    return IIO_VAL_INT;
        }
        unreachable();
```

Após algumas avaliações e reenvios um dos nossos patches foi integrado. Entretanto o outro não estava perfeitamente correto e algumas mudanças que nós não entendemos muito bem nos foram solicitadas.

Eu já havia compilado o _kernel_ linux no passado, mas nunca explorado/modificado ele, tampouco enviado contribuições. Primeiramente, foi divertido conhecer o design do projeto e entender a organização de subsistemas e módulos. Todavia, saber que toda a organização do projeto é feito através de listas de email é algo perturbador e uma barreira de entrada muito grande para iniciantes.

## Licenças

A aula sobre licenças para mim foi bastante proveitosa pois eu tinha pouco (quase nenhum) conhecimento sobre o assunto. Hoje posso dizer que pelo menos tenho alguma noção do que as diferentes licenças significam.

## KW

Fomos introduzidos a um ciclo de contribuição com o `kw` que nós resolvemos bem rápido pois tinhamos a intenção de voltar a trabalhar com o projeto para a segunda parte da disciplina.

Nossa contribuição foi apenas uma correção de uma redefinição desnecessária de uma variável no arquivo principal do `kw`.

```bash
KW_SOUND_DIR='/usr/share/sounds/kw'
```

## Contribuições (`nushell`)

Os planos mudaram. Nesse momento eu havia começado a adotar `nu` como meu _shell_ padrão e encontrei [nushell/nu_scripts](https://github.com/nushell/nu_scripts). Gostei muito da coleção e comecei a usar no meu cotidiano. Foi aí que encontrei uma forma de unir o útil ao agradável e escrever utilitários para nushell como contribuições para a segunda etapa da disciplina. Depois de algum tempo, notei que podia fazer algo ainda melhor criando um script para nushell que ajudasse com _completions_ para o `kw` (que era o nosso alvo original de contribuições).

## Empacotamento

Tivemos um primeiro tutorial com o Joênio (que por algum motivo desconhecido eu consegui fazer sem maiores problemas) e depois fomos para nossa falha tentativa de empacotar o nushell para debian. O problema aqui era que o nushell possui dezenas de dependências não empacotada para debian.

Originalmente, não achei que dependências fossem um problema pois o nushell é um programa de binário único que compila suas dependências de forma estática. Todavia os pacotes debian são pacotes de código fonte, que precisam de compilar o programa por conta própria. Aí está o problema, pouquíssimas `crates` (nome dado para bibliotecas em Rust) foram empacotadas. E há uma razão para isso.

Observe uma pequena parte da lista de dependências não empacotadas:

- librust-nu-cmd-lang-0.94+default-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+mimalloc-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+sqlite-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+system-clipboard-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+trash-support-dev (>= 0.94.2-~~)
- librust-nu-cmd-lang-0.94+which-support-dev (>= 0.94.2-~~)

Note que todas tem um prefixo em comum: `librust-nu-cmd-lang-0.94`. Isso pois todos esses pacotes pertencem à mesma `crate`(`librust`): `nu-cmg-lang` que é a biblioteca com a definição da linguagem `nu` usada pelo `nushell`. "Mas se todos vem da mesma biblioteca, por quê pacotes diferentes?" A resposta está depois do `+`.

Rust possui um sistema de compilação condicional, onde durante a compilação de uma data `crate` você pode declarativamente compilar ou não partes do código. Essas partes são chamadas de _features_ e são elas que aparecem depois do `+` na lista de dependências. As features disponíveis para essa `crate` são: `mimalloc`, `sqlite`, `system-clipboard`, `trash-support` e `which-support`. Além disso, uma crate pode definir um conjundo dessas features como "default features" (no caso acima o padrão é não usar nenhuma dessas features).

Portanto, manter uma única `crate` Rust empacotada significa manter um pacote para cada feature além de um pacote padrão. Compreensível muitas bibliotecas Rust não criarem pacotes. Além de que, Rust já possui seu próprio gerenciados de pacotes (Cargo) que permite instalar programas em Rust em qualquer plataforma. Portanto, não parece compensar o esforço de manter pacotes para crates Rust de forma geral.

## Próximos Passos

Já foi avisado pelo professor Paulo Meirelles que haverá uma disciplina que funcionará como sequência da disciplina atual e meu plano é participar dela e provavelmente me aprofundar mais no `nushell` agora contribuindo com o projeto principal em si. Além de continuar (ocasionalmente) contribuindo com projetos de software livre.
