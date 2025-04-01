export const useValidatePw = () => {

    const validate = (password) => {
        // weitere Validierungsmechanismen (Sonderzeichen etc..)
        console.log(password)
        if (password.length < 8 ){
            return "Passwort muss mindestens 8 Zeichen lang sein"
        }
        if (password.length > 64) {
            return "Passwort darf nicht länger als 64 Zeichen sein"
        }
        return null
    }
    return {validate}
}