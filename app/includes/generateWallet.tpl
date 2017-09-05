<main class="tab-pane block--container active" ng-if="globalService.currentTab==globalService.tabs.generateWallet.id" ng-controller='walletGenCtrl' role="main" ng-cloak>

  <article class="block__wrap gen__1" ng-show="!wallet">

    <section class="block__main gen__1--inner">
      <br />
      <h1 translate="NAV_GenerateWallet" aria-live="polite"> Create New Wallet</h1>
      <a tabindex="0" role="button" class="btn btn-primary" func="generateSingleWallet" ng-click="genNewWallet()" translate="NAV_GenerateWallet">Generate Wallet</a>
      <br>
    </section>

    <section class="block__help">
      <h2 translate="GEN_Help_4">Guides &amp; FAQ</h2>
      <ul>
        <li><strong>
          <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-create-a-new-wallet" target="_blank" rel="noopener" translate="GEN_Help_5">
            How to Create a Wallet
          </a>
        </strong></li>
        <li><strong>
          <a href="https://myetherwallet.groovehq.com/knowledge_base/categories/getting-started-443" target="_blank" rel="noopener" translate="GEN_Help_6">
            Getting Started
          </a></strong></li>
      </ul>
    </section>

  </article>

  <article role="main" class="block__wrap gen__3" ng-show="wallet">

    <section class="block__main gen__3--inner">

      <br />

      <h1 translate="GEN_Label_5"> Save your Private Key</h1>
      <input aria-label="{{'x_PrivKey'|translate}}" aria-describedby="x_PrivKeyDesc"
             value="{{wallet.getPrivateKeyString()}}"
             class="form-control"
             type="text"
             readonly="readonly"
             style="max-width: 50rem;margin: auto;"/>

      <br />

      <a tabindex="0" aria-label="{{'x_Print'|translate}}" aria-describedby="x_PrintDesc" role="button" class="btn btn-primary" ng-click="printQRCode()" translate="x_Print">PRINT</a>

      <div class="warn">
        <p><strong>Do not lose it!</strong> It cannot be recovered if you lose it.</p>
        <p><strong>Do not share it!</strong> Your funds will be stolen if you use this file on a malicious/phishing site.</p>
        <p><strong>Make a backup!</strong> Secure it like the millions of dollars it may one day be worth.</p>
      </div>

      <br />

    </section>

    <section class="block__help">
      <h2 translate="GEN_Help_4">Guides &amp; FAQ</h2>
      <ul>
        <li><a href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-save-slash-backup-my-wallet" target="_blank" rel="noopener">
          <strong translate="HELP_2a_Title">How to Save & Backup Your Wallet.</strong>
        </a></li>
        <li><a href="https://myetherwallet.groovehq.com/knowledge_base/topics/protecting-yourself-and-your-funds" target="_blank" rel="noopener">
          <strong translate="GEN_Help_15">Preventing loss &amp; theft of your funds.</strong>
        </a></li>
        <li><a href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-are-the-different-formats-of-a-private-key" target="_blank" rel="noopener">
          <strong translate="GEN_Help_16">What are these Different Formats?</strong>
        </a></li>
      </ul>

      <h2 translate="GEN_Help_17"> Why Should I? </h2>
      <ul>
        <li translate="GEN_Help_18"> To have a secondary backup. </li>
        <li translate="GEN_Help_19"> In case you ever forget your password. </li>
        <li>
          <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-safely-slash-offline-slash-cold-storage-with-myetherwallet" target="_blank" rel="noopener" translate="GEN_Help_20">Cold Storage</a>
        </li>
      </ul>

      <h2 translate="x_PrintDesc"></h2>

    </section>

  </article>

</main>
