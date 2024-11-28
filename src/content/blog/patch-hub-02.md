---
title: '[Patch-Hub #02] - Logger'
description: 'Primeira feature, um logger'
pubDate: 'Sep 25 2024'
heroImage: '/patch-hub.png'
tags: ['patch-hub', 'mac0214', 'mac0456']
---

Assim que iniciei no projeto, o David me mostrou uma feature que ele mesmo havia começado a implementar: um sistema de logs. A implementação inicial era bem simples, contando com uma fila de logs, uma função que adicionava mensagens novas à fila e um sistema que imprimia todas as mensagens no terminal assim que o programa fosse encerrado. Comecei então a desenvolver mais em cima dessa ideia.

## Armazenamento dos Logs

Guardar os logs em uma fila e exibir eles ao final da aplicação tem um problema: eles não podem ser armazenados permanentemente. Uma vez que você feche o terminal, aqueles logs estarão perdidos para sempre. Além disso, caso a aplicação fosse encerrada abruptamente por um erro interno não tratado, os logs poderiam ser perdidos.

Implementei então um mecanismo que armazenaria os logs em arquivos imediatamente assim que fossem gerados, minimizando chances de que sejam perdidos, além de permitir que o usuário os consulte no futuro. Além disso, agora toda mensagem de log contava com um instante de tempo indicando o momento em que foi gerada.

## Níveis de Log

Já que os logs serão todos armazenados em arquivos, é necessário exibir todos no terminal? A resposta é: depende. Vamos deixar que o usuário decida. Para isso, criei diferentes níveis de log: `INFO`, `WARN` e `ERROR`. Todos são escritos no arquivo de log, mas apenas os suficientemente graves serão exibidos no terminal (verbosidade). Isso é uma configuração do usuário (feature em andamento).

## Desafio Técnico

Aqui entram uns detalhes técnicos sobre a forma como o logger foi implementado. O logger precisa de armazenar alguns dados (nome do arquivo de logs, nível de verbosidade, logs a serem exibidos no terminal, etc). Portanto, faz sentido criar uma estrutura de dados para isso que tenha métodos interessantes para que os desenvolvedores possam registrar suas mensagens de log. Porém, não faz sentido que possam instanciar mais do que um logger, precisamos de um _Singleton_ (uma estrutura de dados que possui apenas uma intância durante toda a execução do programa).

Diferentemente de linguagens como Kotlin e Java, singletons não são exatamente uma coisa em Rust. Quero dizer, é possível implementar, todavia são necessárias alguns malabarismos. É fácil impedir a criação de instâncias do tipo `Logger` que criei. Porém criar apenas uma instância requer algumas escolhas.

Essa instância precisa de ser acessível globalmente por tanto deve ser criada como uma `static` que seria um valor que irá durar por toda a execução do código. Ela não pode ser constante/imutável já que preciso de modificar ela pra adicionar novos logs à fila. Por tanto ela poderia ser uma `static mut LOGGER: Logger` ou ser de um tipo que permite mutabilidade interna como `static LOGGER: Mutex<Logger>`.

Mutabilidade? Ah sim, um pouco de Rust. Por padrão valores em Rust não podem ser modificados, isso impede uma série de problemas em ambientes paralelos, ao mesmo tempo que nos limita em vários aspectos. Daí entra o termo `mut`. Coisas `mut` em Rust podem ter seus valores modificados seguindo algumas regras. Uma delas por exemplo, diz que apenas uma _referência mutável_ pode existir por vez. Criando uma `static mut` globalmente permite que várias referências mutáveis existam. Por isso, para utilizar uma dessas referências o compilador nos obriga a marcar o código como inseguro (`unsafe`) indicando que estamos assumindo os riscos. Um `Mutex` é um tipo que adiciona uma barreira de segurança, garantindo que apenas uma referência mutável exista por vez através do método `Mutex::lock`, porém isso vem com um leve custo de desempenho.

```rs
//! src/singleton.rs
use std::sync::Mutex;

// Unicas instâncias de Singleton possíveis
pub static mut SINGLE_MUT_REF: Singleton = Singleton { x: 42 };
pub static SINGLE_MUTEX: Mutex<Singleton> = Mutex::new(Singleton { x: 42 });

// Campo `x` privado, logo não é possível construir Singleton diretamente
pub struct Singleton {
    x: i32,
}

impl Singleton {
    // Método que requer mutabilidade
    pub fn set_x(&mut self, x: i32) {
        self.x = x;
    }
}
```

```rs
//! src/main.rs
use std::thread;

use singleton::{SINGLE_MUTEX, SINGLE_MUT_REF};

mod singleton;

fn main() {  
    // Thread que acessa SINGLE_MUT_REF e SINGLE_MUTEX  
    let handle = thread::spawn(move || {
        // Acesso inseguro a SINGLE_MUT_REF
        let a2 = unsafe{ &mut SINGLE_MUT_REF };
        // Acesso seguro a SINGLE_MUTEX
        let mut b2 = SINGLE_MUTEX.lock().unwrap();
        
        a2.set_x(44); // Pode gerar condição de corrida
        b2.set_x(44); // Não gera condição de corrida
    });
    
    // Acesso inseguro a SINGLE_MUT_REF
    let a1 = unsafe{ &mut SINGLE_MUT_REF };
    // Acesso seguro a SINGLE_MUTEX
    let mut b1 = SINGLE_MUTEX.lock().unwrap();


    a1.set_x(43); // Pode gerar condição de corrida
    b1.set_x(43); // Não gera condição de corrida
    
    drop(b1); // unlock
    handle.join().unwrap();
}
```

A existência de multiplas referências mutáveis só é um problema em ambientes multithread onde de fato as duas referências mutáveis possam ser usadas simultaneamente gerando uma condição de corrida. Todavia, o patch-hub não faz uso de nenhuma forma de paralelismo até o momento, portanto optamos pela abordagem não segura mas mais rápida.

## Próximos Passos

- Permitir configuração da verbosidade.
- Aplicar coloração aos logs no terminal.
- De fato utilizar os mecanismos de logging ao longo do código.