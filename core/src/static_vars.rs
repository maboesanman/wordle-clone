use crate::dictionary::Dictionary;
use std::{collections::HashMap, sync::{Mutex, MutexGuard}};
use once_cell::sync::OnceCell;
use rand::SeedableRng;
use rand_chacha::ChaCha8Rng;

pub static DICTIONARIES: OnceCell<HashMap<usize, Dictionary<'static>>> = OnceCell::new();
pub static RNG: OnceCell<Mutex<ChaCha8Rng>> = OnceCell::new();

pub fn get_dictionary(n: u32) -> Option<&'static Dictionary<'static>> {
    let dicts = DICTIONARIES.get_or_init(|| {
        let raw: HashMap<usize, &'static [u8]> = include!(concat!(env!("OUT_DIR"), "/dictionaries.rs"));

        let mut converted: HashMap<usize, Dictionary<'static>> = HashMap::new();
        for (n, s) in raw {
            converted.insert(n, Dictionary::new(n, s));
        }
        converted
    });

    dicts.get(&(n as usize))
}

pub fn get_rng() -> MutexGuard<'static, ChaCha8Rng> {
    RNG.get_or_init(|| {
        let mut seed: [u8; 32] = [0; 32];
        getrandom::getrandom(&mut seed).unwrap();
        let rng = ChaCha8Rng::from_seed(seed);
        Mutex::new(rng)
    }).lock().unwrap()
}