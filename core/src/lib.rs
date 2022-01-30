mod utils;
mod dictionary;
mod wordle;

use crate::dictionary::Dictionary;

use std::{collections::HashMap, sync::{Mutex, MutexGuard}};

use once_cell::sync::OnceCell;
use rand::SeedableRng;
use rand_chacha::ChaCha8Rng;
use wasm_bindgen::prelude::*;
use wordle::WordleGuess;

pub static DICTIONARIES: OnceCell<HashMap<usize, Dictionary<'static>>> = OnceCell::new();
pub static RNG: OnceCell<Mutex<ChaCha8Rng>> = OnceCell::new();

fn get_dictionary(n: u32) -> Option<&'static Dictionary<'static>> {
    let dicts = DICTIONARIES.get_or_init(|| {
        let raw: HashMap<usize, &'static str> = include!(concat!(env!("OUT_DIR"), "/dictionaries.rs"));
        
        let mut converted: HashMap<usize, Dictionary<'static>> = HashMap::new();
        for (n, s) in raw {
            converted.insert(n, Dictionary::new(n, s));
        }
        converted
    });

    dicts.get(&(n as usize))
}

fn get_rng() -> MutexGuard<'static, ChaCha8Rng> {
    RNG.get_or_init(|| {
        let mut seed: [u8; 32] = [0; 32];
        getrandom::getrandom(&mut seed).unwrap();
        let rng = ChaCha8Rng::from_seed(seed);
        Mutex::new(rng)
    }).lock().unwrap()
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// get a random n letter English word.
#[wasm_bindgen]
pub fn get_random_word(n: u32) -> String {
    let dict = match get_dictionary(n) {
        Some(d) => d,
        None => return "".to_string(),
    };
    let mut rng = get_rng();
    let rng = &mut *rng;
    dict.random_word(rng).to_string()
}

/// determine if `word` is a valid english word or not.
#[wasm_bindgen]
pub fn validate_word(word: &str) -> bool {
    let dict = match get_dictionary(word.len() as u32) {
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