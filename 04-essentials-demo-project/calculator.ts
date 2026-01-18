// data: 
// initial amount
// annual contribution
// expected return rate
// duration in years

// Type InvestmentData
type InvestmentData = {
    initialAmount: number;
    annualContribution: number;
    expectedReturn: number;
    duration: number;
}

// Type InvestmentResult
type InvestmentResult = {
    year: string;
    totalAmount: number;
    totalInterestEarned: number;
    totalContributions: number;
}

// Using Type Alias
type CalculationResult = InvestmentResult[] | string

// returns CalculationResult = InvestmentResult[] | string
function calculateInvestment(data: InvestmentData): CalculationResult {   
    const { initialAmount, annualContribution, expectedReturn, duration } = data

    if (initialAmount < 0) {
        return 'Initial amount must be at least 0.'
    }

    if (duration <= 0) {
        return 'No valid amount of years provided.'
    }

    if (expectedReturn < 0) {
        return 'Expected return must be at least 0.'
    }

    let total = initialAmount
    let totalContributions = 0
    let totalInterestEarned = 0

    const annualResults: InvestmentResult[] = []

    for (let i = 0; i < duration; i++) {
        total = total * (1 + expectedReturn) // 5000 * (1 + 0.08) = 5400

        totalInterestEarned = total - totalContributions - initialAmount // 5400 - 0 - 5000 = 400
        // console.log(`totalInterestEarned: ${totalInterestEarned}`)

        totalContributions = totalContributions + annualContribution // 0 + 500
        total = total + annualContribution // 5400 + 500 = 5900

        annualResults.push({
            year: `Year ${i + 1}`,
            totalAmount: total,
            totalInterestEarned,
            totalContributions
        })
    }

    return annualResults

}

// print (output) the result data
function printResults(results: CalculationResult) {
    if (typeof results === 'string') {
        console.log(results)
        return
    }

    for (const yearEndResult of results) {
        console.log(yearEndResult.year)
        console.log(`Total: ${yearEndResult.totalAmount.toFixed(0)}`)
        console.log(`Total Contributions: ${yearEndResult.totalContributions.toFixed(0)}`)
        console.log(`Total Interest Earned: ${yearEndResult.totalInterestEarned.toFixed(0)}`)
        console.log('------------------------------')
    }
}

const investmentData: InvestmentData = {
    initialAmount: 5000,
    annualContribution: 500,
    expectedReturn: 0.08,
    duration: 10
}

const results = calculateInvestment(investmentData )
printResults(results)