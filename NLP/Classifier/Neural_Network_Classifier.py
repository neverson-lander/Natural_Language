# use natural language toolkit
import nltk
from nltk.stem.lancaster import LancasterStemmer
from unicodedata import normalize
import string
import os
import json
import datetime
import numpy as np
import time
import sys
#stemmer = LancasterStemmer() #Stem em inglês

stemmer = nltk.stem.RSLPStemmer() #deixa somente a raiz da palavra, Stem para portugês
words = []
classes = []
synapse_0 = []
synapse_1 = []

#carrega arquivo de palavras geradas no treinamento (Stemmed)
fileDir = os.path.dirname(os.path.realpath('__file__'))

def loadSynapse():
    # Carrega as sinapses calculadas, salvas durante o treinamento
    #synapse_file = os.path.join(fileDir, '../Model/'+ token + '.json')
    synapse_file = os.path.join(fileDir, '../../../../../Empresa/Natural_Language/Model/'+ token + '.json')
    
    with open(synapse_file) as data_file: 
        global synapse_0
        global synapse_1
        global words
        global classes

        synapse = json.load(data_file) 
        synapse_0 = np.asarray(synapse['synapse0']) 
        synapse_1 = np.asarray(synapse['synapse1'])
        words = np.asarray(synapse['words'])
        classes = np.asarray(synapse['classes'])



#words_file = os.path.join(fileDir, '../Model/words.json') 
#with open(words_file) as data_file: 
#    words = json.load(data_file) 

#carrega arquivo de classes geradas no treinamento
#classes_file = os.path.join(fileDir, '../Model/classes.json')
#with open(classes_file) as data_file: 
#    classes = json.load(data_file)     

# funão não linear, mapeia qualquer valor entre 0 e 1
def sigmoid(x):
    output = 1/(1+np.exp(-x)) #Se não for derivada, retorna esse
    return output

# convert o output da funão sigmoid em derivada
def sigmoid_output_to_derivative(output):
    return output*(1-output)

#função responsavel por limpar a sentença, aplica tokenize e stem em cada palavra 
def clean_up_sentence(sentence):
    # aplica o tekenize quebrando a sentença em varias palavras
    sentence_words = nltk.word_tokenize(sentence)
    # aplica stem em cada palavra, gerando a raiz da palavra
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    return sentence_words

# retorna um bag de palavras considerando: 0 ou 1 para cada palavra no bag que existir na sentença
def bow(sentence, words, show_details=False): #words são as palavra com stem, das classes de treinamento inicial.
    #aplica tokenize e stem nas palavras da sentença
    sentence_words = clean_up_sentence(sentence) 
    # bag of words
    bag = [0]*len(words)  
    for s in sentence_words:
        for i,w in enumerate(words):
            if w == s: # Se a palavra da sentença existir nas palavras das classes de treinamento inicial, adiciona 1 ou mantem 0
                bag[i] = 1
                if show_details: 
                    print ("found in bag: %s" % w)

    #print("Bag np bow: ", np.array(bag))  
    return(np.array(bag)) # retorna uma matrix numpy baseada no exemplo de treino 
                          # com 0 e 1 para cada palavra, cada coluna corresponde a um nó de entrada
 
def think(sentence, show_details=False):
    global synapse_0
    global synapse_1

    x = bow(sentence.lower(), words, show_details) #retorna uma matrix numpy com as palavras da senteça encontradas nas palavras de treinamento
    if show_details:
        print ("sentence:", sentence, "\n bow:", x)
    # X é a sentença de input transofrmada em um bag de paralvras
    l0 = x
    # matrix de multiplicação do input e hidden layer 
    l1 = sigmoid(np.dot(l0, synapse_0))
    # layer de saida
    l2 = sigmoid(np.dot(l1, synapse_1))  

    #print("imprime synapse 0: ", synapse_0)
    #print("imprime synapse 1: ", synapse_1)  
    return l2

# probability threshold
ERROR_THRESHOLD = 0.2

def classify(sentence, show_details=False):
    array_result = []
    obj = {}
    results = think(sentence, show_details)
    results = [[i,r] for i,r in enumerate(results) if r>ERROR_THRESHOLD ] 
    results.sort(key=lambda x: x[1], reverse=True) 
    #array_result =[[classes[r[0]],r[1]] for r in results]

    for r in results:
        array_result.append({"class": classes[r[0]], "score": r[1]})
    
    obj["results"] = array_result
    return obj

def clearSentence(sentence):
    text = removePunctuation(sentence)
    return normalize('NFKD', text).encode('ASCII','ignore').decode('ASCII')

def removePunctuation(sentence):
    return sentence.translate(sentence.maketrans('','',string.punctuation))

try:
    param = sys.stdin.readlines()
    ##token = sys.argv[1]
    lines = json.loads(param[0])
    array = np.array(lines)
    token = array[0]
    
    ##sentence = sys.argv[2]
    sentence = array[1]
    sentence = clearSentence(sentence)
    loadSynapse()

    ##token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFzc2lmeVRva2VuIjoiQ2xhc3NpZmljYWRvciBBdm9uIiwiaWF0IjoxNDk3ODk2MzkyfQ.iuNcuaCT7Yd4tmr3FjElpcG5TvWxx7wkJVN7zJb9PQ0"
    ##sentence = "bom dia, estou devendo?, obrigado"
    ##loadSynapse()
    
    print(json.dumps(classify(sentence)))

except:
    sys.exit("Ocorreu um erro durante a classificação!")  




#print("")    
#print("")    

#while True:
#  try:
#    input_var = input("Digite alguma coisa: ")
#    print(classify(input_var))

#  except(KeyboardInterrupt, EOFError, SystemExit):
#    break     