import time
import requests
import random
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.live import Live

console = Console()
API_URL = "http://127.0.0.1:5000"

def fetch_blocks():
    try:
        response = requests.get(f"{API_URL}/api/blocks", timeout=5)
        response.raise_for_status()
        return response.json().get('chain', [])
    except Exception as e:
        console.print(f"[bold red][Error][/bold red] Could not connect to API: {e}")
        return []

def fetch_users():
    try:
        response = requests.get(f"{API_URL}/api/users", timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        console.print(f"[bold red][Error][/bold red] Could not connect to API: {e}")
        return []

def render_blockchain_audit():
    console.clear()
    console.print(Panel("[bold cyan]Blockchain Audit Trail[/bold cyan]", expand=False))
    
    blocks = fetch_blocks()
    if not blocks:
        console.print("[yellow]No blocks found or unable to fetch.[/yellow]")
        console.input("\nPress Enter to return...")
        return
        
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Index", justify="right", style="cyan")
    table.add_column("Timestamp", style="yellow")
    table.add_column("Transactions", justify="right")
    table.add_column("Hash", style="green")
    
    for block in blocks:
        b_hash = str(block.get('hash', ''))
        b_hash_short = b_hash[:16] + "..." if len(b_hash) > 16 else b_hash
        
        # Get transaction count, handling whether it's a list or not
        txs = block.get('transactions', [])
        tx_count = str(len(txs)) if isinstance(txs, list) else "0"

        table.add_row(
            str(block.get('index', '?')),
            str(block.get('timestamp', ''))[:19],
            tx_count,
            b_hash_short
        )
        
    console.print(table)
    console.input("\n[dim]Press Enter to return to Main Menu...[/dim]")

def render_accounts_view():
    console.clear()
    console.print(Panel("[bold cyan]Registered Accounts[/bold cyan]", expand=False))
    
    users = fetch_users()
    if not users:
        console.print("[yellow]No users found or unable to fetch.[/yellow]")
        console.input("\nPress Enter to return...")
        return
        
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Address", style="green")
    table.add_column("Username", style="cyan")
    table.add_column("KYC Verified", justify="center")
    
    for u in users:
        is_kyc = u.get('is_kyc_verified', False)
        kyc_status = "[bold green]Yes[/bold green]" if is_kyc else "[bold red]No[/bold red]"
        table.add_row(str(u.get('address', '?')), str(u.get('username', '?')), kyc_status)
        
    console.print(table)
    console.input("\n[dim]Press Enter to return to Main Menu...[/dim]")

def render_live_ticker():
    console.clear()
    console.print(Panel("[bold cyan]Live AMM & Block Status[/bold cyan]", expand=False))
    console.print("[dim]Press Ctrl+C to stop the live ticker.[/dim]\n")
    
    def generate_ticker_table(btc_price, eth_price, block_height):
        table = Table(show_header=True, header_style="bold blue", title="Live Market & Network Status")
        table.add_column("Asset / Metric", style="cyan")
        table.add_column("Value", style="green", justify="right")
        
        table.add_row("BTC/USD", f"${btc_price:,.2f}")
        table.add_row("ETH/USD", f"${eth_price:,.2f}")
        table.add_row("Current Block Height", str(block_height))
        table.add_row("Network Status", "[bold green]ONLINE & SYNCED[/bold green]")
        return table
        
    btc_price = 64500.00
    eth_price = 3400.00
    
    try:
        blocks = fetch_blocks()
        block_height = len(blocks) if blocks else 1
    except:
        block_height = 1

    try:
        with Live(generate_ticker_table(btc_price, eth_price, block_height), refresh_per_second=4, console=console) as live:
            while True:
                time.sleep(0.5)
                # Mock fluctuations
                btc_price += random.uniform(-100, 100)
                eth_price += random.uniform(-15, 15)
                # Randomly mock a block mine
                if random.random() > 0.90:
                    block_height += 1
                live.update(generate_ticker_table(btc_price, eth_price, block_height))
    except KeyboardInterrupt:
        pass
    
def main():
    current_screen = "MAIN_MENU"
    
    while True:
        if current_screen == "MAIN_MENU":
            console.clear()
            menu_text = (
                "[1] Audit Blockchain\n"
                "[2] View All Accounts\n"
                "[3] Live AMM Ticker\n"
                "[4] Exit"
            )
            console.print(Panel(menu_text, title="[bold blue]Backchain Admin Dashboard[/bold blue]", expand=False))
            
            try:
                choice = console.input("[bold yellow]Select an option (1-4): [/bold yellow]")
                choice = int(choice.strip())
                
                if choice == 1:
                    current_screen = "AUDIT_BLOCKCHAIN"
                elif choice == 2:
                    current_screen = "VIEW_ACCOUNTS"
                elif choice == 3:
                    current_screen = "AMM_LIVE_TICKER"
                elif choice == 4:
                    console.print("[bold green]Exiting...[/bold green]")
                    break
                else:
                    raise ValueError
                    
            except ValueError:
                # Graceful Error Handling!
                console.print("[bold red][Invalid Input][/bold red] Please enter a numerical ID between 1 and 4.")
                time.sleep(1.5)
                
        elif current_screen == "AUDIT_BLOCKCHAIN":
            render_blockchain_audit()
            current_screen = "MAIN_MENU"
            
        elif current_screen == "VIEW_ACCOUNTS":
            render_accounts_view()
            current_screen = "MAIN_MENU"
            
        elif current_screen == "AMM_LIVE_TICKER":
            render_live_ticker()
            current_screen = "MAIN_MENU"

if __name__ == "__main__":
    main()
