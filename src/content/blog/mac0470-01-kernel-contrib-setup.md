---
title: '[MAC0470#01] - Setup do Ambiente'
description: 'Como foi o setup do ambiente de desenvolvimento do kernel'
pubDate: 'Apr 02 2024'
heroImage: '/kernel-dev.jpg'
tags: ['mac0470']
---

Aqui vou abordar a curta experiência de setup do ambiente de desenvolvimento do Kernel que foi orientado pelos tutoriais do [FLUSP](https://flusp.ime.usp.br/) na disciplina MAC0470 - Desenvolvimento de Software Livre.

Nas primeiras semanas da disciplina, após a curta intrudução às licenças e afins. Começamos a seguir os tutoriais sugeridos para setup de um ambiente para desenvolvimento do Kernel para a arquitetura [ARM](https://pt.wikipedia.org/wiki/Arquitetura_ARM). São eles: [Use QEMU and libvirt to setup a Linux kernel test environment](https://flusp.ime.usp.br/kernel/qemu-libvirt-setup/), [Build the Linux kernel for ARM](https://flusp.ime.usp.br/kernel/build-linux-for-arm/), [Introduction to kernel build configuration and modules](https://flusp.ime.usp.br/kernel/modules-intro/).

Consegui seguir todos os 3 tutoriais introdutórios quase que a risca. Os únicos problemas foram algumas etapas que envolviam montar coisas nas máquinas virtuais. Nesses casos precisei de dar permissões de superusuário (o motivo ainda é desconhecido). Além dos _scripts_ fornecidos nos tutoriais possuirem vários erros. E também muitos problemas no setup do acesso via _ssh_. Após muito esforço, consegui chegar às etapas de compilação do kernel. No hardware que eu usei, [o Rigel](/blog/my-equipment#rigel) a compilação do kernel por inteiro leva cerca de 20 minutos.

O setup acabou ficando um pouco confuso e até mal feito (partes pela incompletude do tutorial, partes por descuido da minha parte). Entretando, ao final da primeira semana de abril, tive mais problemas com o meu setup, onde minha máquina virtual desapareceu. Isso foi o que me levou a tentar reiniciar os tutoriais agora indo a fundo pesquisando e resolvendo os bugs.

[Continua...](/blog/mac0470-02-kernel-contrib-resetup.md)