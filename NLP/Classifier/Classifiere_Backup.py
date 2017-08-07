# use natural language toolkit
import nltk
from nltk.stem.lancaster import LancasterStemmer
import os
import json
import datetime
import numpy as np
import time
#stemmer = LancasterStemmer() #Stem em inglês

stemmer = nltk.stem.RSLPStemmer() #deixa somente a raiz da palavra, Stem para portugês
words = []
classes = []

#carrega arquivo de palavras geradas no treinamento (Stemmed)
fileDir = os.path.dirname(os.path.realpath('__file__'))

words_file = os.path.join(fileDir, '../Model/words.json') 
with open(words_file) as data_file: 
    words = json.load(data_file) 

#carrega arquivo de classes geradas no treinamento
classes_file = os.path.join(fileDir, '../Model/classes.json')
with open(classes_file) as data_file: 
    classes = json.load(data_file)     

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

# Carrega as sinapses calculadas, salvas durante o treinamento
synapse_file = os.path.join(fileDir, '../Model/synapses.json')
with open(synapse_file) as data_file: 
    synapse = json.load(data_file) 
    synapse_0 = np.asarray(synapse['synapse0']) 
    synapse_1 = np.asarray(synapse['synapse1'])

def classify(sentence, show_details=False):
    results = think(sentence, show_details)
    results = [[i,r] for i,r in enumerate(results) if r>ERROR_THRESHOLD ] 
    results.sort(key=lambda x: x[1], reverse=True) 
    return_results =[[classes[r[0]],r[1]] for r in results]
    print ("%s \n classification: %s" % (sentence, return_results))
    return return_results

print("")    
print("")    

while True:
  try:
    input_var = input("Digite alguma coisa: ")
    print(classify(input_var))

  except(KeyboardInterrupt, EOFError, SystemExit):
    break     