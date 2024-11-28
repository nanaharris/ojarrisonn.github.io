---
title: '[Patch-Hub #03] - Renderizando Patches'
description: 'Integrando o patch-hub com mais ferramentas de software livre'
pubDate: 'Sep 26 2024'
heroImage: '/patch-hub.png'
tags: ['patch-hub', 'mac0214', 'mac0456']
---

Uma das features centrais do patch-hub é a capacidade de ver o conteúdo dos patches, isto é, um `patch`/`diff`. Um `diff` é o formato usado pelo `git` para registrar as mudanças (diferenças) entre diferentes commits. O problema é que esse formato foi pensado em ser fácil para o git utilizar, não é exatamente muito legível.

Um pequeno exemplo de como um diff se parece

```txt
diff --git a/src/app.rs b/src/app.rs
index 89c7e61..c576a03 100644
--- a/src/app.rs
+++ b/src/app.rs
@@ -563,6 +563,9 @@ impl App {
             if let Ok(git_send_email_option) = edit_config.extract_git_send_email_option() {
                 self.config.set_git_send_email_option(git_send_email_option)
             }
+            if let Ok(patch_renderer) = edit_config.extract_patch_renderer() {
+                self.config.set_patch_renderer(patch_renderer.into())
+            }
         }
     }
 
diff --git a/src/app/config.rs b/src/app/config.rs
index ff8629e..9b23565 100644
--- a/src/app/config.rs
+++ b/src/app/config.rs
@@ -168,6 +168,10 @@ impl Config {
         self.git_send_email_options = git_send_email_options;
     }
 
+    pub fn set_patch_renderer(&mut self, patch_renderer: PatchRenderer) {
+        self.patch_renderer = patch_renderer;
+    }
+
     pub fn save_patch_hub_config(&self) -> io::Result<()> {
         let config_path = if let Ok(path) = env::var("PATCH_HUB_CONFIG_PATH") {
             path
diff --git a/src/app/edit_config.rs b/src/app/edit_config.rs
index 0687e7d..73fd726 100644
--- a/src/app/edit_config.rs
+++ b/src/app/edit_config.rs
@@ -20,6 +20,10 @@ impl EditConfigState {
             EditableConfig::GitSendEmailOpt,
             config.get_git_send_email_options().to_string(),
         );
+        config_buffer.insert(
+            EditableConfig::PatchRenderer,
+            config.patch_renderer().to_string(),
+        );
 
         EditConfigState {
             config_buffer,
@@ -145,6 +149,11 @@ impl EditConfigState {
         // TODO: Check if the option is valid
         Ok(git_send_emial_option)
     }
+
+    pub fn extract_patch_renderer(&mut self) -> Result<String, ()> {
+        let patch_renderer = self.extract_config_buffer_val(&EditableConfig::PatchRenderer);
+        Ok(patch_renderer)
+    }
 }
 
 #[derive(Debug, Hash, Eq, PartialEq)]
@@ -153,6 +162,7 @@ enum EditableConfig {
     CacheDir,
     DataDir,
     GitSendEmailOpt,
+    PatchRenderer,
 }
 
 impl EditableConfig {
@@ -162,6 +172,7 @@ impl EditableConfig {
             1 => Some(EditableConfig::CacheDir),
             2 => Some(EditableConfig::DataDir),
             3 => Some(EditableConfig::GitSendEmailOpt),
+            4 => Some(EditableConfig::PatchRenderer),
             _ => None, // Handle out of bounds
         }
     }
@@ -173,6 +184,7 @@ impl Display for EditableConfig {
             EditableConfig::PageSize => write!(f, "Page Size"),
             EditableConfig::CacheDir => write!(f, "Cache Directory"),
             EditableConfig::DataDir => write!(f, "Data Directory"),
+            EditableConfig::PatchRenderer => write!(f, "Patch Renderer (bat, delta, diff-so-fancy)"),
             EditableConfig::GitSendEmailOpt => write!(f, "`git send email` option"),
         }
     }
```

Poderiamos então criar uma feature no patch-hub para dar alguma estilização a esses arquivos de diff para facilitar o entendimento do que está escrito nesses patches. Mas por que implementar isso do zero? Estamos trabalhando com software livre, podemos utilizar ferramentas produzidas por outras pessoas para enriquecer a nossa aplicação. Conheço, de antemão, 3 ferramentas de terminal capazes de dar estilização a arquivos de patches: `bat`, `delta`, `diff-so-fancy`.

## [`bat`](https://github.com/sharkdp/bat)

O `cat` com asas (nas palavras dos desenvolvedores) é uma ferramenta que dá syntax-highlight em uma centena de diferentes formatos de texto, dentre ele o formato `diff`, aplicando cores para indicar os marcadores de posição `@@`, linhas removidas (prefixadas com `-`) e linhas adicionadas (prefixadas com `+`). Uma ferramenta até que bastante popular e que com esse simples recurso já pode melhorar bastante a legibilidade dos patches.

[![bat on patch-hub](https://asciinema.org/a/nDKHt1Q1eyg7eKr1xGuZPzJXF.svg)](https://asciinema.org/a/nDKHt1Q1eyg7eKr1xGuZPzJXF)

## [`delta`](https://github.com/dandavison/delta)

Também chamado de git-delta foi pensado para ser usado pelo `git` como pager do comando `git diff`. Mas também pode ser usado para renderizar o conteúdo de arquivos de patches. O `delta` produz uma renderização muito mais rica do que o `bat` com separadores e até syntax-highlight de cada hunk.

[![delta on patch-hub](https://asciinema.org/a/ITkDDrem3qb8MPcYQ15jEm871.svg)](https://asciinema.org/a/ITkDDrem3qb8MPcYQ15jEm871)

## Desafio de Dependências Externas

Em conversa com o David resolvemos ter a seguinte abordagem quanto ao uso dessas ferramentas externas para renderizar os patches:

- Damos configurações predefinidas de quais ferramentas usar definindo suas flags
- Essas ferramentas são completamente opcionais então o sistema deve funcionar sem elas instaladas

## Foi Dificil?

Usar as ferramentas em si não foi complicado. A dificuldade estava em integrar elas ao fluxo do patch-hub. Foi necessário:

- Criar opção nas configurações para selecionar um renderizador
- Coletar o conteúdo dos patches e passar pelo renderizador antes de desenhar ele no terminal
- Converter o texto ansi colorido em um texto colorido do `ratatui` (biblioteca de interface que estamos usando) usando `ansi-to-tui`
- Finalmente, desenhar o texto na tela 

Esse processo todo com certeza me enriqueceu do ponto de habilidade de buscar soluções, já que uma ideia primária seria transformar a parte de `preview` da tela em um pseudo-terminal que executasse as ferramentas (isso seria demasiado complicado e certamente menos eficiente). Além de aprender a realizar uma boa integração com a base de código já existente. Por exemplo, ao criar uma nova opção de configuração tive que:

- Incluir na bateria de testes
- Adicionar ela na tela de edição de configurações
- Coletar a opção a partir de variáveis de ambiente
