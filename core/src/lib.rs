mod utils;
mod dictionary;
mod wordle;

use crate::dictionary::Dictionary;

use std::{collections::HashMap, sync::{Mutex, MutexGuard}};

use once_cell::sync::OnceCell;
use rand::SeedableRng;
use rand_chacha::ChaCha8Rng;
use wasm_bindgen::prelude::*;

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

#[wasm_bindgen]
pub fn validate_word(word: String) -> bool {
    let dict = match get_dictionary(word.len() as u32) {
        Some(d) => d,
        None => return false,
    };

    dict.validate_word(&word)
}

#[wasm_bindgen]
pub struct Wordle(wordle::Wordle<'static, 'static>);

#[wasm_bindgen]
impl Wordle {
    /// Create a new random wordle, or make one from the optional word argument
    #[wasm_bindgen(constructor)]
    pub fn new(n: u32, word: Option<String>) -> Option<Wordle>
    {
        let dict = get_dictionary(n)?;
        Some(Wordle(match word {
            Some(word) => {
                wordle::Wordle::new_from_word(dict, word)
            },
            None => {
                let mut rng = get_rng();
                let rng = &mut *rng;
                wordle::Wordle::new_random(dict, rng)
            },
        }))
    }

    /// execute a guess.
    /// 
    /// the response is the error message. empty means no error.
    pub fn guess(&mut self, word: &str) -> String {
        match self.0.guess(word) {
            Ok(_) => String::new(),
            Err(err) => err,
        }
    }

    /// Create a new random wordle 
    pub fn finished(&self) -> bool {
        self.0.finished()
    }

    /// get current state of wordle
    pub fn current_state(&self) -> JsValue {
        let wordle_state = self.0.current_state();

        JsValue::from_serde(&wordle_state).unwrap()
    }
}

#[wasm_bindgen(typescript_custom_section)]
const IWORDLE_STATE: &'static str = r#"
interface IWordleState  {
    guesses: IWordleGuess[];
}
interface IWordleGuess  {
    characters: IWordleGuessCharacter[];
}
interface IWordleGuessCharacter {
    character: string;
    hint: WordleLetterHint;
}
"#;
