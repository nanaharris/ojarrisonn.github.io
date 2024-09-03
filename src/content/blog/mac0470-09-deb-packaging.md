---
title: '[MAC0470#09] - Workshop de Empacotamento'
description: 'Criando pacotes '
pubDate: 'Jun 05 2024'
heroImage: '/nuscripts.jpg'
tags: ['mac0470']
---

Tivemos um workshop de empacotamento para Debian com [Joenio Marques da Costa](https://joenio.me/) em uma das aulas, onde ele nos conduziu para que fizemos um pacote de exemplo com a biblioteca de _Hello World_ do Perl.

## Parte 1 - Máquina Virtual

A primeira parte do tutorial era criar uma máquina virtual com Debian Testing (para termos versões mais atualizadas dos pacotes) e um ambiente padronizado para poder realizar o empacotamente. Para isso, usei o Virt Manager que já haviamos usado no início da disciplina e segui o tutorial do Debian sobre [Debian Testing](https://wiki.debian.org/DebianTesting). Depois instalei as dependências indicadas por ele no tutorial e pronto.

## Parte 2 - Criando pacote para Acme::Helloworld

Usamos `dh-make-perl` para baixar o código fonte da biblioteca e criar os templates dos arquivos necessários para criar o pacote. Os principais arquivos criados estão dentro da pasta `debian/` e aqui vamos modificar apenas `copyright`, `control` e `changelog`.

### Copyright

Nesse arquivo listamos as licensas usadas no projeto. O arquivo gerado pelo `dh-make-perl` está incompleto, então precisamos de encontrar a licensa e o ano do copyright para corrigir o arquivo.

### Control

Aqui listamos as dependências do projeto. No template produzido as dependências corretas já estão listadas, apenas atualizamos (por uma sugestãp do Joênio) a linha `Standards-Version` para: 

```yaml
Standards-Version: 4.7.0
```

E por fim checamos se tudo está correto com o arquivo com a ferramenta `cme`

### Changelog

Como o nome sugere, nesse arquivo ficam listadas as mudanças que foram feitas desde a última versão do projeto.

## Parte 3 - Construindo o Pacote

Para construir o pacote basta

```bash
sudo pbuilder create
BUILDER=pbuilder git-pbuilder
```

Não tive nenhum problema durante a criação do pacote além dos warnings mencionados no blog do Joênio

Por fim, testei a instalação do pacote com

```bash
sudo dpkg -i ../libacme-helloworld-perl_0.01-1_all.deb
```

O pacote é criado no diretório pai do diretório atual

## Próxima Etapa

Com o fim desse pequeno tutorial, nos foi solicitado que empacotassemos um outro projeto e nós (eu, Laís Nuto e Thiago Duvanel) resolvemos nos juntar para criar um pacote Debian do `nushell`.