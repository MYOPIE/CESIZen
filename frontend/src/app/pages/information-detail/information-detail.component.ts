import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Information, InformationService } from '../../services/information.service';
import { parseRichContent, RichContentBlock, getVideoEmbedUrl } from '../../shared/utils/rich-content.util';

@Component({
  selector: 'app-information-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './information-detail.component.html',
  styleUrls: ['./information-detail.component.scss']
})
export class InformationDetailComponent implements OnInit {
  information: Information | null = null;
  contentBlocks: RichContentBlock[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private informationService: InformationService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.isLoading = false;
      this.errorMessage = 'Article introuvable.';
      this.cdr.detectChanges();
      return;
    }

    this.informationService.getInformationById(id).subscribe({
      next: (information) => {
        this.information = information;
        this.contentBlocks = parseRichContent(information.content);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger cet article.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getSafeVideoUrl(url: string | undefined): SafeResourceUrl | null {
    if (!url) {
      return null;
    }

    const embedUrl = getVideoEmbedUrl(url);
    if (!embedUrl) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
