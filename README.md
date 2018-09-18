
https://code.google.com/archive/p/crypto-js/

https://gist.github.com/billyxs/c9a338b5443d346ff9eb

https://gist.github.com/artjomb/7ef1ee574a411ba0dd1933c1ef4690d1


1. PBKDF2 (ou Argon 2 - https://password-hashing.net/) para derivar chaves a partir de senhas;
2. AES no modo GCM para cifrar/decifrar;
3. HMAC SHA256 para o cálculo de MAC; - OK
4. Os campos login e senha não podem ser guardados em texto plano no arquivo; - OK
5. Bom método de gerenciamento das chaves usadas no programa; - Pensar
6. A figura 1 pode ser usada para guiar a forma de usar derivação de chaves. Pode existir uma “MK” (master key – chave mestre), que será a chave derivada de alguma senha que o usuário digita.