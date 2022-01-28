use rand::Rng;

use crate::dictionary::Dictionary;


pub struct Wordle<'w, 'd> {
    dict: &'w Dictionary<'d>,
    word: &'d str,
    guesses: Vec<String>,
    max_guesses: usize,
}

impl<'w, 'd> Wordle<'w, 'd> {
    pub fn new_random<R>(dict: &'w Dictionary<'d>, rng: &mut R) -> Self
    where R: Rng
    {
        Self {
            dict,
            word: dict.random_word(rng),
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
            let hints = guess_hints_string(self.word, &guess);
            println!("{hints}")
        }
        let word = self.word;
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
            if last == self.word {
                return true;
            }
        }
        return false;
    }
}

enum LetterHint {
    Missing,
    Misplaced,
    Correct,
}

fn hint(word: &str, guess: &str) -> Vec<LetterHint> {
    guess.chars().zip(word.chars()).map(|(guess_c, word_c)| {
        if guess_c == word_c {
            LetterHint::Correct
        } else if word.contains(guess_c) {
            LetterHint::Misplaced
        } else {
            LetterHint::Missing
        }
    }).collect()
}

fn guess_hints_string(word: &str, guess: &str) -> String {
    let hints = hint(word, guess);

    let iter = guess.chars().zip(hints.into_iter());
    let mut result = String::new();
    for (c, h) in iter {
        match h {
            LetterHint::Missing => result.push_str(&format!(" {c} ")),
            LetterHint::Misplaced => result.push_str(&format!("({c})")),
            LetterHint::Correct => result.push_str(&format!("[{c}]")),
        }
    }

    result
}