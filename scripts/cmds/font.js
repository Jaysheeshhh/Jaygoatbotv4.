const axios = require("axios");
const fs = require("fs");

const fontMaps = [
  {
    name: 'cursive',
    map: {
      ' ': ' ',
      'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
      'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺',
      'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃',
      'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗',
      'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠',
      'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    },
  },
  {
    name: 'comic',
    map: {
      ' ': ' ',
      'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙',
      'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢',
      'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
      'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ',
      'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ',
      'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
    },
  },
  {
    name: 'bold',
    map: {
      ' ': ' ',
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
      'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾',
      'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
      'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤',
      'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    },
  },
{
  name: 'italic',
  map: {
    ' ': ' ',
    'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ',
    'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞',
    'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
    'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼',
    'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅',
    'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍',
  },
},

  {
    name: 'fraktur',
    map: {
      ' ': ' ',
      'a': '𝔄', 'b': '𝔅', 'c': '𝔇', 'd': '𝔈', 'e': '𝔉', 'f': '𝔉', 'g': '𝔊', 'h': '𝔍',
      'i': '𝔎', 'j': '𝔏', 'k': '𝔐', 'l': '𝔏', 'm': '𝔑', 'n': '𝔒', 'o': '𝔒', 'p': '𝔓', 'q': '𝔔',
      'r': '𝔕', 's': '𝔖', 't': '𝔗', 'u': '𝔘', 'v': '𝔙', 'w': '𝔚', 'x': '𝔛', 'y': '𝔜', 'z': '𝔷',
      'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ',
      'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔',
      'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
    },
  },
  {
    name: 'sbd',
    map: {
      ' ': ' ',
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
      'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪',
      'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
      'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐',
      'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    },
  },
  {
  name: 'monospace',
  map: {
    ' ': ' ',
    'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',
    'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚',
    'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
    'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷',
    'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀',
    'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
  },
  },
{
  name: 'bubbles',
  map: {
    ' ': ' ',
    'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
    'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ',
    'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
    'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ',
    'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ',
    'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
  },
},
{
  name: 'morse',
  map: {
    ' ': ' ',
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
    'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
    'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..',
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
  },
},
{
  name: 'creepy',
  map: {
    ' ': ' ',
    'a': 'ค', 'b': '๒', 'c': 'ς', 'd': '๔', 'e': 'є', 'f': 'Ŧ', 'g': 'ﻮ', 'h': 'ђ',
    'i': 'เ', 'j': 'ן', 'k': 'қ', 'l': 'l', 'm': '๓', 'n': 'ภ', 'o': '๏', 'p': 'թ', 'q': 'ợ',
    'r': 'г', 's': 'ร', 't': 'Շ', 'u': 'ย', 'v': 'ש', 'w': 'ฬ', 'x': 'א', 'y': 'ץ', 'z': 'z',
    'A': 'ค', 'B': '๒', 'C': 'ς', 'D': '๔', 'E': 'є', 'F': 'Ŧ', 'G': 'ﻮ', 'H': 'ђ',
    'I': 'เ', 'J': 'ן', 'K': 'қ', 'L': 'l', 'M': '๓', 'N': 'ภ', 'O': '๏', 'P': 'թ', 'Q': 'ợ',
    'R': 'г', 'S': 'ร', 'T': 'Շ', 'U': 'ย', 'V': 'ש', 'W': 'ฬ', 'X': 'א', 'Y': 'ץ', 'Z': 'z',
  },
 },
{
  name: 'baybayin',
  map: {
    ' ': ' ',
    'a': 'ᜀ', 'b': 'ᜊ', 'c': 'ᜅ', 'd': 'ᜇ', 'e': 'ᜌ', 'f': 'ᜐ', 'g': 'ᜎ', 'h': 'ᜑ',
    'i': 'ᜊ', 'j': 'ᜌ', 'k': 'ᜃ', 'l': 'ᜋ', 'm': 'ᜋᜒ', 'n': 'ᜈ', 'o': 'ᜉ', 'p': 'ᜒ', 'q': 'ᜆ',
    'r': 'ᜐ', 's': 'ᜐ', 't': 'ᜆ', 'u': 'ᜑ', 'v': 'ᜈ', 'w': 'ᜏ', 'x': 'ᜐ', 'y': 'ᜌ', 'z': 'ᜃ',
    'A': 'ᜀ', 'B': 'ᜊ', 'C': 'ᜅ', 'D': 'ᜇ', 'E': 'ᜌ', 'F': 'ᜐ', 'G': 'ᜎ', 'H': 'ᜑ',
    'I': 'ᜊ', 'J': 'ᜌ', 'K': 'ᜃ', 'L': 'ᜋ', 'M': 'ᜋ', 'N': 'ᜈ', 'O': 'ᜉ', 'P': 'ᜒ', 'Q': 'ᜆ',
    'R': 'ᜐ', 'S': 'ᜐ', 'T': 'ᜆ', 'U': 'ᜑ', 'V': 'ᜈ', 'W': 'ᜏ', 'X': 'ᜐ', 'Y': 'ᜌ', 'Z': 'ᜃ',
  },
 },
{
  name: 'glitchy',
  map: {
    ' ': ' ',
    'a': 'ᗩ', 'b': 'β', 'c': 'ς', 'd': 'ᕧ', 'e': 'Ξ', 'f': 'ғ', 'g': 'ﾓ', 'h': '卄', 'i': '!!',
    'j': 'J', 'k': 'Ҡ', 'l': 'Ↄ', 'm': 'ᗰ', 'n': '几', 'o': 'Ө', 'p': 'Ԁ', 'q': 'Ҩ', 'r': '尺',
    's': '丂', 't': '千', 'u': 'ㄩ', 'v': 'ν', 'w': 'ω', 'x': '×', 'y': 'ү', 'z': '乙',
    'A': 'ᗩ', 'B': 'β', 'C': 'ς', 'D': 'ᕧ', 'E': 'Ξ', 'F': 'ғ', 'G': 'ﾓ', 'H': '卄', 'I': '!!',
    'J': 'J', 'K': 'Ҡ', 'L': 'Ↄ', 'M': 'ᗰ', 'N': '几', 'O': 'Ө', 'P': 'Ԁ', 'Q': 'Ҩ', 'R': '尺',
    'S': '丂', 'T': '千', 'U': 'ㄩ', 'V': 'ν', 'W': 'ω', 'X': '×', 'Y': 'ү', 'Z': '乙',
  },
},
{
  name: 'crossed',
  map: {
    'a': 'a̶', 'b': 'b̶', 'c': 'c̶', 'd': 'd̶', 'e': 'e̶', 'f': 'f̶', 'g': 'g̶', 'h': 'h̶',
    'i': 'i̶', 'j': 'j̶', 'k': 'k̶', 'l': 'l̶', 'm': 'm̶', 'n': 'n̶', 'o': 'o̶', 'p': 'p̶', 'q': 'q̶',
    'r': 'r̶', 's': 's̶', 't': 't̶', 'u': 'u̶', 'v': 'v̶', 'w': 'w̶', 'x': 'x̶', 'y': 'y̶', 'z': 'z̶',
    'A': 'A̶', 'B': 'B̶', 'C': 'C̶', 'D': 'D̶', 'E': 'E̶', 'F': 'F̶', 'G': 'G̶', 'H': 'H̶',
    'I': 'I̶', 'J': 'J̶', 'K': 'K̶', 'L': 'L̶', 'M': 'M̶', 'N': 'N̶', 'O': 'O̶', 'P': 'P̶', 'Q': 'Q̶',
    'R': 'R̶', 'S': 'S̶', 'T': 'T̶', 'U': 'U̶', 'V': 'V̶', 'W': 'W̶', 'X': 'X̶', 'Y': 'Y̶', 'Z': 'Z̶',
  },
},
{
  name: 'covered',
  map: {
    ' ': ' ',
    'a': 'a̺͆', 'b': 'b̺͆', 'c': 'c̺͆', 'd': 'd̺͆', 'e': 'e̺͆', 'f': 'f̺͆', 'g': 'g̺͆', 'h': 'h̺͆', 'i': 'i̺͆', 'j': 'j̺͆',
    'k': 'k̺͆', 'l': 'l̺͆', 'm': 'm̺͆', 'n': 'n̺͆', 'o': 'o̺͆', 'p': 'p̺͆', 'q': 'q̺͆', 'r': 'r̺͆', 's': 's̺͆', 't': 't̺͆',
    'u': 'u̺͆', 'v': 'v̺͆', 'w': 'w̺͆', 'x': 'x̺͆', 'y': 'y̺͆', 'z': 'z̺͆',

    'A': 'A̺͆', 'B': 'B̺͆', 'C': 'C̺͆', 'D': 'D̺͆', 'E': 'E̺͆', 'F': 'F̺͆', 'G': 'G̺͆', 'H': 'H̺͆', 'I': 'I̺͆', 'J': 'J̺͆',
    'K': 'K̺͆', 'L': 'L̺͆', 'M': 'M̺͆', 'N': 'N̺͆', 'O': 'O̺͆', 'P': 'P̺͆', 'Q': 'Q̺͆', 'R': 'R̺͆', 'S': 'S̺͆', 'T': 'T̺͆',
    'U': 'U̺͆', 'V': 'V̺͆', 'W': 'W̺͆', 'X': 'X̺͆', 'Y': 'Y̺͆', 'Z': 'Z̺͆',
  },
},
{
  name: 'smiley',
  map: {
    ' ': ' ',
    'A': 'Ă̈', 'B': 'B̆̈', 'C': 'C̆̈', 'D': 'D̆̈', 'E': 'Ĕ̈', 'F': 'F̆̈', 'G': 'Ğ̈', 'H': 'H̆̈', 'I': 'Ĭ̈', 'J': 'J̆̈',
    'K': 'K̆̈', 'L': 'L̆̈', 'M': 'M̆̈', 'N': 'N̆̈', 'O': 'Ŏ̈', 'P': 'P̆̈', 'Q': 'Q̆̈', 'R': 'R̆̈', 'S': 'S̆̈', 'T': 'T̆̈',
    'U': 'Ŭ̈', 'V': 'V̆̈', 'W': 'W̆̈', 'X': 'X̆̈', 'Y': 'Y̆̈', 'Z': 'Z̆̈',

    'a': 'ă̈', 'b': 'b̆̈', 'c': 'c̆̈', 'd': 'd̆̈', 'e': 'ĕ̈', 'f': 'f̆̈', 'g': 'ğ̈', 'h': 'h̆̈', 'i': 'ĭ̈', 'j': 'j̆̈',
    'k': 'k̆̈', 'l': 'l̆̈', 'm': 'm̆̈', 'n': 'n̆̈', 'o': 'ŏ̈', 'p': 'p̆̈', 'q': 'q̆̈', 'r': 'r̆̈', 's': 's̆̈', 't': 't̆̈',
    'u': 'ŭ̈', 'v': 'v̆̈', 'w': 'w̆̈', 'x': 'x̆̈', 'y': 'y̆̈', 'z': 'z̆̈',
  },
},
{
  name: 'boxed',
  map: {
    'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹',
    'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃',
    'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
    'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸', 'J': '🄹',
    'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃',
    'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉',
  },
},
];

module.exports = {
  config: {
    name: 'font',
    version: '1.0',
    author: 'Coffee',
    countDown: 0,
    role: 0, // Set role to 0 for public access
    shortDescription: 'Convert text to different fonts',
    longDescription:
      'Choose from various font styles like bold, italic, cursive, etc. and transform your text into a unique visual format.',
    category: 'font',
    guide: '-font <font type> <text>',
  },
  onStart: async ({ event, api, args }) => {
    if (args.length === 1 && args[0].toLowerCase() === 'list') {
      const exampleText = 'Hello';
      const header = '═════════════════   𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙵𝚘𝚗𝚝𝚜 ƪ⁠(⁠‾⁠.⁠‾⁠“⁠)⁠┐\n═════════════════\n𝙵𝚘𝚗𝚝 𝙽𝚊𝚖𝚎       𝚂𝚊𝚖𝚙𝚕𝚎';

      // Calculate the maximum length of the font names
      const maxFontNameLength = Math.max(...fontMaps.map(fontMap => fontMap.name.length));

      // Create the font list with perfect vertical alignment
      const availableFontsList = fontMaps.map((fontMap) => {
        const exampleChar = exampleText.split('')
          .map((char) => fontMap.map[char] || char)
          .join('');

        // Adjust the padding for font names
        const formattedFontName = `★ ${fontMap.name.padEnd(maxFontNameLength)}`;

        // Calculate the padding for perfect vertical alignment
        const padding = ' '.repeat(maxFontNameLength - fontMap.name.length);

        return `${formattedFontName}${padding}  ${exampleChar}`;
      }).join('\n');

      return api.sendMessage(
        `${header}\n${availableFontsList}`,
        event.threadID,
        event.messageID
      );
    }

    if (args.length < 2) {
      return api.sendMessage(
        "|｡_｡| Invalid Usage: Please use the command with a font type and text.\n\nExample: -font bold i love you \n\nChat -𝘧𝘰𝘯𝘵 𝘭𝘪𝘴𝘵 to see more! •ᴗ•",
        event.threadID,
        event.messageID
      );
    }

    const command = args[0].toLowerCase();
    if (command === 'list') {
      const availableFonts = fontMaps.map((fontMap) => `★ ${fontMap.name}`).join('\n');
      return api.sendMessage(`Available fonts:\n${availableFonts}`, event.threadID, event.messageID);
    }

    const fontType = args.shift();
    const inputText = args.join(' ');

    const chosenFontMap = fontMaps.find(
      (fontMap) => fontMap.name === fontType.toLowerCase()
    );

    if (!chosenFontMap) {
      const availableFonts = fontMaps.map((fontMap) => `★ ${fontMap.name}`).join('\n');
      return api.sendMessage(
        `|｡_｡| Invalid Font Type: Available fonts:\n${availableFonts}\n\nExample: {p}font bold Hello! •ᴗ•`,
        event.threadID,
        event.messageID
      );
    }

    const outputText = inputText
      .split('')
      .map((char) => chosenFontMap.map[char] || char)
      .join('');

    return api.sendMessage(outputText, event.threadID, event.messageID);
  },
};
