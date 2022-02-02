mod utils;
mod dictionary;
mod wordle;
mod static_vars;

use wasm_bindgen::prelude::*;
use wordle::WordleGuess;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// get a random n letter English word.
#[wasm_bindgen]
pub fn get_random_word(n: u32) -> String {
    let dict = match static_vars::get_dictionary(n) {
        Some(d) => d,
        None => return "".to_string(),
    };
    let mut rng = static_vars::get_rng();
    let rng = &mut *rng;
    dict.random_word(rng).to_string()
}

/// determine if `word` is a valid english word or not.
#[wasm_bindgen]
pub fn validate_word(word: &str) -> bool {
    let dict = match static_vars::get_dictionary(word.len() as u32) {
        Some(d) => d,
        None => return false,
    };

    dict.validate_word(&word)
}

/// evaluate a guess.
/// returns an empty string if word and guess are not the same length.
/// returns a string representing the intended hints
/// 
/// X: miss
/// O: correct
/// V: misplaced
/// 
/// for example
/// 
/// evaluate_guess("HOUSE", "HOMES") -> "OOXVV"
#[wasm_bindgen]
pub fn evaluate_guess(word: &str, guess: &str) -> String {
    let wg = WordleGuess::new(word, guess);
    wg.get_mask()
}

/// determine if the guesses are legal according to hard mode
/// guesses are whitespace separated
#[wasm_bindgen]
pub fn validate_hard(word: &str, guesses: &str) -> bool {
    todo!()
}

/// determine if the guesses are legal according to hardcore mode
/// guesses are whitespace separated
#[wasm_bindgen]
pub fn validate_hardcore(word: &str, guesses: &str) -> bool {
    todo!()
}