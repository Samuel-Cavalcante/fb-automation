const puppeteer = require('puppeteer');
require("dotenv").config();

(async () => {

    async function getPages() {
        browserPages = await browser.pages()
    }

    async function closePage(n) {
        await getPages()
        let totalPages = (parseInt(n) - 1)
        await browserPages[totalPages].close()
    }

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let browserPages
    await getPages()
    const blankPage = browserPages[0]
    await blankPage.close()

    //Login Page
    await page.goto('https://facebook.com/');
    await page.type('[name="email"]', process.env.login_fb)
    await page.type('[name="pass"]', process.env.password_fb)
    await page.click('[type="submit"]')

    await page.waitForNavigation()

    const title = process.env.post_title
    const message = process.env.post_message
    
    const groupsObject = {
        'Olx Meireles e Aldeota (Fortaleza-ce)': '2073044289654345',
        'Aluguel e Venda de Imoveis em Fortaleza': '436425379828404',
        'VENDAS - FORTALEZA CEARÁ': '4830527307057423',
        'Feira da Madrugada Fortaleza Compras & Vendas': 'feiradamadrugadafortalezacomprasevendas',
        'vendas fortaleza': '3249559715369024',
        'Grupo de vendas Fortaleza e região metropolitana': '2991169807784937',
        'Vendas em Fortaleza': '2763466187299867',
        'DIVULGAÇÃO GRANJA LISBOA': '2746837802220140',
        'Olx, Mercado Livre Maracanaú': '2022297998082537',
        'OLX FORTALEZA 2': 'olxfortal3',
        'Feira Zé Avelino': '1666630790233823',
        'OLX FORTALEZA_CEARA': '1628607004042130',
        'Mulheres Virtuosas ❤️': '1611987962352464',
        'Venda certa fortaleza': '1491326334590046',
        'Vendas Fortaleza e caucaia': '1199424933738290',
        'Feira José Avelino': '928868294146500',
        'Olx Fortaleza CE': '900715334058399',
        'Desapega Geral Fortaleza': 'desapegafortaleza',
        'Mercado Livre Fortaleza 🎁👠👕👡🩴📱⌨🖨🖱': 'mercadolivrefortalivre',
        'OLX Fortaleza CE': 'olxfortal',
        'OLX Anúncios de Compra e Venda em Fortaleza': 'anunciocompra',
        'Fortaleza Vendas E Trocas': 'oblivionzgrupoguinaldo',
        'VENDAS FORTALEZA': '426929007347384',
        'VENDAS FORTALEZA-CE': 'vendasfortalezace',
        'Genibaú': '251030631732890',
        'BELA VISTA VENDAS FORTALEZA CEARA': '235113654425710',
        'OLX Fortaleza 3 (Compra & Venda)': 'olxfortaleza3',
    }

    const groupsSellObject = {
        'COMPRA E VENDA DE SOM AUTOMOTIVO': '621860624629024',
    }

    async function createPost() {
        const escrevaAlgo = (await page.$x("//*[text()='Escreva algo...']"))[0]
        // Esse techo de código está clickando no Spam "Escreva algo" relacionado a postagem.
        // Está clickando 2 vezes pq o 1° click é em uma tela em branco do própio facebook.
        try {
            await escrevaAlgo.click()
            await page.waitForTimeout(1500)

            await escrevaAlgo.click()
            await page.waitForTimeout(2000)

        } catch (error) {
            await page.waitForTimeout(5000)
            await createPost()

        } finally {
            return
        }
    }

    async function writeText() {
        
        async function writeTitle(){
            try {
                await page.waitForTimeout(500)
                await page.keyboard.type(title)
                
            } catch (error) {
                await page.waitForTimeout(5000)
                await writeTitle()
                
            } finally {
                return
            }
        }
        
        async function writeMessage(){
            const pageMessage = (await page.$x("/html/body/div[1]/div/div[1]/div/div[6]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/form/div/div[1]/div/div/div[1]/div/div[2]/div[1]/div[2]/div[1]/div[1]"))[0]
            try { 
                await pageMessage.click()
                await page.waitForTimeout(1000)
                await page.keyboard.type(message)
                
            } catch (error) {
                await page.waitForTimeout(5000)
                await writeMessage()
                
            } finally {
                return
            }
        }
        
        await page.waitForTimeout(1000)
        await writeTitle()
        await writeMessage()
    }

    async function sendPhotos() {

        async function clickIcon() {

            try {
                // Icone de fotos/videos
                const fotosEVideos = (await page.$x("/html/body/div[1]/div/div[1]/div/div[6]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/form/div/div[1]/div/div/div[1]/div/div[3]/div[1]/div[2]/div[1]/div/span/div/div/div[1]/div/div/div[1]/i"))[0]
                await fotosEVideos.click()

            } catch (error) {
                await page.waitForTimeout(5000)
                await clickIcon()

            } finally {
                return
            }
        }

        async function addPhoto() {

            try {
                // full XPath da Label "Adicionar Fotos e Videos"            
                const addFotosEVideos = (await page.$x("/html/body/div[1]/div/div[1]/div/div[6]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/form/div/div[1]/div/div/div[1]/div/div[2]/div[1]/div[2]/div[2]/div/div[1]/div/div[1]/div/div[1]/div/div"))[0] 
                // await page.waitForTimeout(500)

                // Selecionando as imagens e clickando na label "Adicionar Fotos e Videos"
                const [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                    await addFotosEVideos.click()
                ]);

                fileChooser.accept(["./imgs/otica-01.jpg", "./imgs/otica-02.jpg", "./imgs/otica-03.jpg", "./imgs/otica-04.jpg"])

            } catch (error) {
                await page.waitForTimeout(5000)
                await addPhoto()

            } finally {
                return
            }
        }

        await page.waitForTimeout(500)
        await clickIcon()
        await page.waitForTimeout(2000)
        await addPhoto()
        await page.waitForTimeout(2000)
    }

    async function sendPost() {
        try {
            const send = (await page.$x("/html/body/div[1]/div/div[1]/div/div[6]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/form/div/div[1]/div/div/div[1]/div/div[3]/div[2]/div/div/div/div[1]"))[0]
            await send.click()
            await page.waitForTimeout(10000)

        } catch (error) {
            await page.waitForTimeout(5000)
            await sendPost()

        } finally {
            return
        }
    }

    for (let i = 0; i < Object.keys(groupsObject).length; i++) {

        let currentGroup = (i + 1)
        let groupName = Object.keys(groupsObject)[i]

        await page.goto(`https://www.facebook.com/groups/${Object.values(groupsObject)[i]}`)

        await page.waitForTimeout(3000)

        await createPost()
        await writeText()
        await sendPhotos()
        await sendPost()

        console.log("\nGrupo " + currentGroup + " Postado")
        console.log("Nome do grupo: " + groupName);
        await page.waitForTimeout(5000)
        
    }

    // for (let i = 0; i < Object.keys(groupsSellObject).length; i++) {

    //     await page.goto(`https://www.facebook.com/groups/${Object.values(groupsSellObject)[i]}`)

    //     await page.waitForTimeout(3000)

    // }

    let qtdGrupos = Object.keys(groupsObject).length
    console.log("\n----------------------------");
    console.log("------ Bot Finalizado ------")
    console.log("---- Grupos postados: " + qtdGrupos + " ---")
    console.log("----------------------------");

    await browser.close();
})();

