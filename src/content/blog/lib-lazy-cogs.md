---
title: 'Lazy Cogs Conception'
description: 'Lazily Clonable Structures in Rust'
pubDate: 'Apr 02 2024'
heroImage: '/lazy-cogs.jpg'
tags: ['rust']
---

During my holidays, I spent some time researching about immutable data structures. This concept is really interesting and I'd like to share with you (if anyone reads this someday) the interesting part of this theorical concept and my implementation of immatable data structures in Rust with the [LazyCogs](https://crates.io/crates/lazy-cogs) library. 

## What are Immutable Data Structures and Lazy Cloning

The name is missleading. An IDS (immutable data structure) isn't a data structure that isn't going to change. It's actually a data structure that isn't _likely_ to change. If you're not planning to write data into the data structure, a clone of this DS could be just a reference to the original. But, as i mentioned before, you can in fact mutate an IDS, but for this we need guarantees.

That's all IDS are about, guarantees about the use of the data. If the data isn't likely to be mutated, clones should be cheap, but you need to keep track of the status of the data so it can be mutated.

Lets take an example. You have a long list of values whose cloning is expensive and you aren't really planning to change most of the data. So when someone asks for a clone of this list, we are going to give them a reference to the original list. This is called a lazy clone. You faked that you cloned the piece of data, but you didn't.

But now we need to keep track that we have someone referencing the original list, it means that we cannot directly mutate our list without any unwanted side effects. Neither the fella who took that fake clone. At this moment, our list is really immutable, if someone try to mutate data in the list, we need to make an actual clone.

But at the moment that our list got mutated, or our friend's list got mutated, both lists are now mutable and any further mutations doesn't require expensive actual clones, until someone asks for another clone of those lists. 

That's the beauty of IDS, those actual clones that are expensive aren't likely to happen. Even tho we have some more space complexity to store metadata and keep track of the status, the time complexity of passing clones of the data around is small and concentrated in a single moment.

## Lazy Cogs

If some concepts of IDS in mind, I started developing LazyCogs, a library with some IDS implementations in Rust. Rust is a language that uses it's quite unique ownership system to manage memory usage. Here we are giving it super powers by adding laziness into Rust (at least for data cloning).

LazyCogs brings a `Lc` "primitive" which gives you the ability lo lazily clone almost any data. It's actually just a wrapper for `Rc` but with methods to handle our immutability thing. `Lc` should be avoid if possible, since LazyCogs provides a trait `LazyClone` that can turn any data structure lazily clonable. If you can implement `LazyClone`, do it by providing a method to check if the structure is safely mutable, a method to create a lazy clone of the structure and a method to eagerly (non-lazy) clone the structure.

We have some implementations of vectors and linked lists that are lazily clonable. The thing with them is that we have "two layers" of laziness. First is that a clone of the entire list is done lazily. Then if you mutate the list, all the elements that haven't been mutated are lazily cloned.

LazyCogs also provides thread-safe aproaches to each structure. But I still have lots of collections to implement and even implement collections that take advantage of IDS that are `LazyClone`.

Feel free to give a star to [LazyCogs](https://github.com/OJarrisonn/LazyCogs) in my GitHub and contribute if you found the idea interesting.

