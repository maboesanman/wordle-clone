mod utils;
mod dictionary;
mod wordle;

use crate::dictionary::Dictionary;

use std::{collections::HashMap, sync::Mutex};

use once_cell::sync::OnceCell;
use rand::SeedableRng;
use rand_chacha::ChaCha8Rng;
use wasm_bindgen::prelude::*;

static DICTIONARIES: OnceCell<HashMap<usize, Dictionary<'static>>> = OnceCell::new();
static RNG: OnceCell<Mutex<ChaCha8Rng>> = OnceCell::new();

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

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn get_random_word(n: u32) -> String {
    let dict = match get_dictionary(n) {
        Some(d) => d,
        None => return "".to_string(),
    };
    let mut rng = RNG.get_or_init(|| {
        let mut seed: [u8; 32] = [0; 32];
        getrandom::getrandom(&mut seed).unwrap();
        let rng = ChaCha8Rng::from_seed(seed);
        Mutex::new(rng)
    }).lock().unwrap();
    let mut rng = &mut *rng;
    dict.random_word(&mut rng).to_string()
}
