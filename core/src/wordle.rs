use rand::Rng;
use serde::{Serialize, Deserialize};
use core::hash::Hash;
use std::collections::HashMap;

use crate::dictionary::Dictionary;

pub struct Wordle<'w, 'd> {
    dict: &'w Dictionary<'d>,
    word: String,
    guesses: Vec<String>,
    max_guesses: usize,
}

impl<'w, 'd> Wordle<'w, 'd> {
    pub fn new_random<R>(dict: &'w Dictionary<'d>, rng: &mut R) -> Self
    where R: Rng
    {
        Self {
            dict,
            word: dict.random_word(rng).to_string(),
            guesses: Vec::new(),
            max_guesses: 6
        }
    }

    pub fn new_from_word(dict: &'w Dictionary<'d>, word: String) -> Self {
        Self {
            dict,
            word,
            guesses: Vec::new(),
            max_guesses: 6
        }
    }

    pub fn guess(&mut self, word: &str) -> Result<(), String> {
        let word = word.to_lowercase();
        let word = word.trim().to_string();
        let correct_length = self.dict.word_size;
        if word.len() != self.dict.word_size {
            return Err(format!("{word} is not {correct_length} letters long."))
        }
        if !self.dict.validate_word(&word) {
            return Err(format!("{word} is not a word."))
        }
        self.guesses.push(word);
        Ok(())
    }

    pub fn print(&self) {
        println!("");
        let current_guess = self.guesses.len();
        let max_guesses = self.max_guesses;
        println!("{current_guess}/{max_guesses}");
        for guess in self.guesses.iter() {
            let hints = guess_hints_string(&self.word, &guess);
            println!("{hints}")
        }
        let word = &self.word;
        if self.finished() {
            println!("{word}")
        }
        println!("");
    }

    pub fn finished(&self) -> bool {
        if self.max_guesses == self.guesses.len() {
            return true;
        }
        if let Some(last) = self.guesses.last() {
            if last == &self.word {
                return true;
            }
        }
        return false;
    }

    pub fn current_state(&self) -> WordleState {
        let guesses = self.guesses.iter().map(|g| {
            let chars = g.chars();
            let hints = hint(&self.word, g).into_iter();
            WordleGuess {
                characters: chars.zip(hints).map(|(character, hint)| WordleGuessCharacter {
                    character,
                    hint
                }).collect()
            }
        }).collect();

        WordleState { guesses }
    }
}

#[derive(Serialize, Deserialize)]
pub struct WordleState {
    pub guesses: Vec<WordleGuess>
}

#[derive(Serialize, Deserialize)]
pub struct WordleGuess {
    pub characters: Vec<WordleGuessCharacter>
}

impl WordleGuess {
    pub fn new(word: &str, guess: &str) -> Self {
        let hints = hint(word, guess).into_iter();

        let characters = guess.chars().zip(hints).map(|(character, hint)| WordleGuessCharacter {
            character,
            hint
        }).collect();

        Self {
            characters
        }
    }

    pub fn get_mask(&self) -> String {
        self.characters.iter().map(|c| match c.hint {
            WordleLetterHint::Missing => 'X',
            WordleLetterHint::Misplaced => 'V',
            WordleLetterHint::Correct => 'O',
        }).collect()
    }
}

#[derive(Serialize, Deserialize)]
pub struct WordleGuessCharacter {
    pub character: char,
    pub hint: WordleLetterHint
}

#[derive(Serialize, Deserialize, Clone, Copy)]
pub enum WordleLetterHint {
    Missing,
    Misplaced,
    Correct,
}

fn hint(word: &str, guess: &str) -> Vec<WordleLetterHint> {
    let guess_chars = ZipIndices::new(guess.chars());
    let word_chars = ZipCounts::new(word.chars());

    guess_chars.zip(word_chars).map(|((guess_c, index), (word_c, count))| {
        if guess_c == word_c {
            WordleLetterHint::Correct
        } else if word.contains(guess_c) {
            if index <= count {
                WordleLetterHint::Misplaced
            } else {
                WordleLetterHint::Missing
            }
        } else {
            WordleLetterHint::Missing
        }
    }).collect()
}

struct ZipCounts<I: Iterator>
where I::Item: Eq + Hash
{
    items: std::vec::IntoIter<(I::Item, usize)>,
}

impl<I: Iterator> ZipCounts<I>
where I::Item: Eq + Hash + Copy
{
    pub fn new(iter: I) -> Self {
        let mut counts: HashMap<I::Item, usize> = HashMap::new();
        let mut vec = vec![];
        for i in iter {
            vec.push((i, 0));
            if counts.contains_key(&i) {
                *counts.get_mut(&i).unwrap() += 1;
            } else {
                counts.insert(i, 1);
            }
        }
        for (v, c) in vec.iter_mut() {
            *c = *counts.get(v).unwrap();
        }

        Self {
            items: vec.into_iter()
        }
    }
}

impl<I: Iterator> Iterator for ZipCounts<I>
where I::Item: Eq + Hash
{
    type Item = (I::Item, usize);

    fn next(&mut self) -> Option<Self::Item> {
        self.items.next()
    }
}


struct ZipIndices<I: Iterator> 
where I::Item: Eq + Hash + Copy
{
    iter: I,
    counts: HashMap<I::Item, usize>
}

impl<I: Iterator> ZipIndices<I>
where I::Item: Eq + Hash + Copy
{
    pub fn new(iter: I) -> Self {
        Self {
            iter,
            counts: HashMap::new()
        }
    }
}

impl<I: Iterator> Iterator for ZipIndices<I>
where I::Item: Eq + Hash + Copy
{
    type Item = (I::Item, usize);

    fn next(&mut self) -> Option<Self::Item> {
        let next = self.iter.next()?;

        let count = match self.counts.get_mut(&next) {
            Some(c) => {
                *c += 1;
                *c
            },
            None => {
                self.counts.insert(next.clone(), 1);
                1
            },
        };

        Some((next, count))
    }
}

fn guess_hints_string(word: &str, guess: &str) -> String {
    let hints = hint(word, guess);

    let iter = guess.chars().zip(hints.into_iter());
    let mut result = String::new();
    for (c, h) in iter {
        match h {
            WordleLetterHint::Missing => result.push_str(&format!(" {c} ")),
            WordleLetterHint::Misplaced => result.push_str(&format!("({c})")),
            WordleLetterHint::Correct => result.push_str(&format!("[{c}]")),
        }
    }

    result
}
