---
title: '[MAC0470#03] - Contribuindo com o Subsistema IIO'
description: 'Minha primeira contribuição (em dupla) com o Kernel'
pubDate: 'Apr 14 2024'
heroImage: '/kernel-dev.jpg'
tags: ['mac0470']
---

Essa nova etapa da disciplina envolvia primeiro conhecer um pouco do subsistema IIO para depois realizar uma contribuição. Aprendemos um pouco sobre os _character devices_ antes de, de fato, começar a estudar o IIO. O tutorial sobre _character devices_ serviu basicamente para nos mostrar que dispositivos de entrada e saída precisam de implementar operações que em geral são: abertura, fechamento, leitura e escrita.

Em seguida, tivemos um tutorial para nos mostrar a "cara" do subsistema IIO. De forma básica, dispositivos IIO vão operar em canais para lidar tanto com leitura de dados quanto escrita e, claro, descrever como são feitas essas operações de leitura e escrita, de modo análogo aos _character devices_.

Por fim, me reuní com minha dupla, [Laís Nuto Rossman](https://example.com), para realizarmos nossa contribuição com o kernel linux. Escolhemos a sugestão 3, relacionada com o uso da função `iio_device_claim_direct_scoped`. Até onde entendemos, atualmente, módulos do IIO precisam de adquirir uma espécie de `lock` (similar ao usado em sistemas concorrentes) para poder realizar suas operações de entrada e saída. Atualmente, isso é feito primeiro adquirindo esse `lock` usando `iio_device_claim_direct_mode`, realizando as operações que deseja e posteriormente realizando um `unlock` usando `iio_device_release_direct_mode`.

O problema é que explicitamente adquirir um `lock` e depois explicitamente soltar ele é um método aberto a falhas. O uso do `iio_device_claim_direct_scoped` dá uma abordagem mais moderna para esse conceito. Em linguagens de programação modernas (vamos usar Rust como exemplo) ao adquirir um `lock` de algo você obtém o objeto que você está tomando posse, e o `unlock` é feito automaticamente assim que a variável onde você guardou o `lock` sai de escopo. Em abordagens clássicas, você adquire um `lock` e não há mecanismos restringindo você a modificar apenas o objeto que você tomou posse. Além de que você corre o risco de esquecer de dar o `unlock` explícito. A sugestão 3 passa justamente por uma modernização análoga à mencionada acima, mas para o sistema de `claim` e `release` do modo direto de acesso dos dispositivos IIO. `claim_scoped` seria uma forma moderna onde o `claim` é liberado assim que sairmos do escopo onde foi feito.

Aplicamos a sugestão em dois módulos: `ad7606.c` e `ad7923.c`, ambos localizados em `drivers/iio/adc`.
