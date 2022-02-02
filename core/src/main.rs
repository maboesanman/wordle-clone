use std::io::{self, BufRead};
use wordle::Wordle;

mod dictionary;
mod wordle;
mod static_vars;

fn main() {
    let std_in = io::stdin();
    let inputs = std_in.lock().lines();


    let size = 5;
    let dict = static_vars::get_dictionary(size).unwrap();
    let mut rng = static_vars::get_rng();

    let mut wordle = Wordle::new_random(dict, &mut *rng);


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