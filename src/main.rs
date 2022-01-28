use std::{collections::HashMap, io::{self, BufRead}};

use wordle::Wordle;

use crate::dictionary::Dictionary;

mod dictionary;
mod wordle;

fn main() {
    let dictionaries = {
        let raw: HashMap<usize, &'static str> = include!(concat!(env!("OUT_DIR"), "/dictionaries.rs"));
        
        let mut converted: HashMap<usize, Dictionary<'static>> = HashMap::new();
        for (n, s) in raw {
            converted.insert(n, Dictionary::new(n, s));
        }
        converted
    };
    
    let mut rng = rand::thread_rng();
    let std_in = io::stdin();
    let inputs = std_in.lock().lines();


    let size = 5;
    let dict = dictionaries.get(&size).unwrap();

    let mut wordle = Wordle::new_random(dict, &mut rng);


    wordle.print();
    for input in inputs {
        let guess = match input {
            Ok(guess) => guess,
            Err(_) => panic!(),
        };

        wordle.guess(&guess).unwrap_or_else(|s| {
            println!("{s}")
        });
        wordle.print();
        if wordle.finished() {
            break
        }
    }
}
